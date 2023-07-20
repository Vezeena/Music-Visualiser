//constructor function for starry sky visualisation
function StarrySky() {
  //visual's name
  this.name = "starry sky";
  this.gui = createGui(this.name);

  //object parameters for starry sky gui (start value, increment, min, max)
  let params = {
    //stars slider
    starSlots: 250,
    starSlotsStep: 1,
    starSlotsMin: 0,
    starSlotsMax: 1000,
  };
  this.gui.addObject(params);

  this.amplitudes = [];
  for (let i = 0; i < params.starSlots; i++) {
    this.amplitudes.push(0);
  }

  //star shape
  this.drawStar = function (x, y, size) {
    beginShape();
    vertex(x - 10 * size, y + 10 * size);
    vertex(x, y + 35 * size);
    vertex(x + 10 * size, y + 10 * size);
    vertex(x + 35 * size, y);
    vertex(x + 10 * size, y - 8 * size);
    vertex(x, y - 35 * size);
    vertex(x - 10 * size, y - 8 * size);
    vertex(x - 35 * size, y);
    vertex(x - 10 * size, y + 10 * size);
    endShape();
  };

  this.draw = function () {
    push();

    //to update star array based on gui slider value
    if (this.amplitudes.length > params.starSlots) {
      this.amplitudes.splice(0, this.amplitudes.length - params.starSlots);
    } else if (this.amplitudes.length < params.starSlots) {
      const newAmplitudes = [];
      for (let i = 0; i < params.starSlots - this.amplitudes.length; i++) {
        newAmplitudes.push(0);
      }
      this.amplitudes = newAmplitudes.concat(this.amplitudes);
    }

    //calculate the bubble width from the amplitude.
    let a = amplitude.getLevel();

    //push to array and shift so always more coming on screen
    this.amplitudes.push(a);
    this.amplitudes.shift();

    //draw the background stars and make them 'twinkle' based on current amplitude
    //alpha value dependent on amplitude to create twinkling effect
    //size and position also affected by amplitude
    for (let i = 0; i < this.amplitudes.length; i++) {
      const alpha = map(this.amplitudes[i], 0, 1, 150, 255);
      stroke(255, 204, 0, alpha);
      fill(255, 204, 0, alpha);
      const h = map(this.amplitudes[i], 0, 1, height, 0);
      const size = map(a, 0, 1, 0.2, 1) * map(this.amplitudes[i], 0, 1, 0.2, 1);
      this.drawStar(i * (width / this.amplitudes.length), h, size);
      this.drawStar(i * (width / this.amplitudes.length), height - h, size);
      noFill();
      noStroke();
    }

    // set opacity colour for ellipses surrounding central star
    fill(0, 255, 170, 127.5);

    //stroke for all central objects
    strokeWeight(5);
    stroke(255, 204, 0);

    //map amplitude to a set of values for ellipses' diameter
    let d = map(a, 0, 1, 50, 350);

    //draw the 4 bubbles to the screen
    ellipse(width / 2 + 100, height / 2, d);
    ellipse(width / 2 - 100, height / 2, d);
    ellipse(width / 2, height / 2 + 100, d);
    ellipse(width / 2, height / 2 - 100, d);

    //central star with hue that changes based on amplitude
    //hue that changes with amplitude
    let hue = round(map(a, 0, 1, 0, 360));
    colorMode(HSL);
    fill(hue, 75, 50);
    colorMode(RGB);

    const size = map(a, 0, 1, 0.5, 10);
    this.drawStar(width / 2, height / 2, size);
    noFill();
    noStroke();
    pop();
  };
}
