//inspiration for beat detect comes from
//https://archive.gamedev.net/archive/reference/programming/features/beatdetection/index.html
class BeatDetect {
  #sampleBuffer;

  constructor() {
    this.#sampleBuffer = [];
  }

  detectBeat(spectrum) {
    let sum = 0;
    //boolean for beat
    let isBeat = false;
    for (let i = 0; i < spectrum.length; i++) {
      sum += spectrum[i] * spectrum[i];
    }
    if (this.#sampleBuffer.length === 60) {
      //detect a beat
      let sampleSum = 0;

      //add everything up
      for (let i = 0; i < this.#sampleBuffer.length; i++) {
        sampleSum += this.#sampleBuffer[i];
      }
      //calculate the average
      let sampleAverage = sampleSum / this.#sampleBuffer.length;

      // this works: let c = 1.1; one below does not!
      let c = this.#calculateConstant(sampleAverage);
      //determine if it's a beat
      if (sum > sampleAverage * c) {
        //beat
        isBeat = true;
      }
      this.#sampleBuffer.splice(0, 1);
      this.#sampleBuffer.push(sum);
    } else {
      this.#sampleBuffer.push(sum);
    }
    return isBeat;
  }

  #calculateConstant(sampleAverage) {
    //calculate the variance across the sample
    //by working out difference between each value and the average
    //and adding values together
    let varianceSum = 0;
    for (let i = 0; i < this.#sampleBuffer.length; i++) {
      varianceSum += this.#sampleBuffer[i] - sampleAverage;
    }
    let variance = varianceSum / this.#sampleBuffer.length;

    //gradient
    let m = -0.15 / (25 - 200);
    // y intercept
    let b = 1 + m * 200;

    //c = mx+b (y=mx+c)
    return m * variance + b;
  }
}

//particles that make up a single firework
class Particle {
  #colour;
  #x;
  #y;
  #angle;
  #initialSpeed;
  speed;

  constructor(x, y, colour, angle, speed) {
    this.#colour = colour;
    this.#x = x;
    this.#y = y;
    this.#angle = angle;
    this.#initialSpeed = speed;
    this.speed = speed;
  }

  draw() {
    this.#update();
    fill(this.#colour);
    ellipse(this.#x, this.#y, 10, 10);
    noFill();
  }

  //update the speed to decrease
  #update() {
    this.speed -= 0.1;

    this.#colour = color(
      red(this.#colour),
      green(this.#colour),
      blue(this.#colour),
      // fade particle as speed goes to 0
      map(this.speed, 0, this.#initialSpeed / 4, 0, 255, true)
    );

    this.#x += cos(this.#angle) * this.speed;
    this.#y += sin(this.#angle) * this.speed;
  }
}

//draw one firework with particles
class Firework {
  // # to signify private
  #particles;
  depleted;

  constructor(colour, x, y, particles, speed) {
    this.#particles = [];
    this.depleted = false;

    const particlesStep = 360 / particles;
    for (let i = 0; i < 360; i += particlesStep) {
      this.#particles.push(new Particle(x, y, colour, i, speed));
    }
  }

  draw() {
    for (let i = 0; i < this.#particles.length; i++) {
      this.#particles[i].draw();
    }
    if (this.#particles[0].speed <= 0) {
      this.depleted = true;
    }
  }
}

//constructor function for final fireworks visualisation
class Fireworks {
  name;
  gui;
  #params;
  #beatDetect;
  #fireworks;

  constructor() {
    this.name = "fireworks";
    this.gui = createGui(this.name);
    this.#params = {
      //boolean for mouse follow toggle
      followMouseApprox: false,
      //boolean for direct mouse follow toggle
      followMouseExact: false,
      //slider for amount of particles shown
      particles: 20,
      particlesStep: 1,
      particlesMin: 3,
      particlesMax: 100,
      //slider for speed of particles
      particlesSpeed: 10,
      particlesSpeedStep: 1,
      particlesSpeedMin: 1,
      particlesSpeedMax: 50,
    };
    this.#beatDetect = new BeatDetect();
    this.#fireworks = [];
    //object parameters for fireworks gui (start value, increment, min, max)
    this.gui.addObject(this.#params);
  }

  #addFirework() {
    let fireworkColour = color(random(0, 255), random(0, 255), random(0, 255));

    let fireworkX = random(width * 0.2, width * 0.8);
    let fireworkY = random(height * 0.2, height * 0.8);

    //if followmouse toggle set to true, fireworks will follow the mouse
    //within a random area +/- 50 pixels from the mouse
    //if direct follow, will be exactly where mouse is
    if (this.#params.followMouseApprox === true) {
      fireworkX = mouseX + random(-50, 50);
      fireworkY = mouseY + random(-50, 50);
    } else if (this.#params.followMouseExact === true) {
      fireworkX = mouseX;
      fireworkY = mouseY;
    }

    this.#fireworks.push(
      new Firework(
        fireworkColour,
        fireworkX,
        fireworkY,
        this.#params.particles,
        this.#params.particlesSpeed
      )
    );
  }

  #removeDepletedFireworks() {
    let i = 0;
    while (i < this.#fireworks.length) {
      if (this.#fireworks[i].depleted) {
        this.#fireworks.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  //draw the wave fireworks to the screen
  draw() {
    push();

    //to show/hide the relevant toggles when the other is selected
    if (this.#params.followMouseApprox) {
      this.gui.prototype.hideControl("followMouseExact");
    } else if (this.#params.followMouseExact) {
      this.gui.prototype.hideControl("followMouseApprox");
    } else {
      this.gui.prototype.showControl("followMouseApprox");
      this.gui.prototype.showControl("followMouseExact");
    }
    angleMode(DEGREES);

    let spectrum = fourier.analyze(1024);
    if (this.#beatDetect.detectBeat(spectrum)) {
      this.#addFirework();
    }

    this.#removeDepletedFireworks();

    for (let i = 0; i < this.#fireworks.length; i++) {
      this.#fireworks[i].draw();
    }

    angleMode(RADIANS);
    pop();
  }
}
