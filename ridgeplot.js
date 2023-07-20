// constructor function for ridge plot visualisation
function RidgePlot() {
  this.name = "ridge plot";
  this.gui = createGui(this.name);

  //object parameters for ridge plot gui (start value, increment, min, max)
  let params = {
    //width slider
    spaceBetween: 10,
    spaceBetweenStep: 1,
    spaceBetweenMin: 0,
    spaceBetweenMax: 50,
    //speed slider
    speed: 0.7,
    speedStep: 0.01,
    speedMin: 0,
    speedMax: 3,
  };
  this.gui.addObject(params);

  //variables for the size and placecment of the ridge plots
  let outputWaves = [];
  let startX;
  let endY;
  let startY;
  let spectrumWidth;

  //resize the plots sizes when the screen is resized.
  this.onResize = function () {
    //variables for the size and placecment of the ridge plots
    startX = width / 5;
    endY = height / 5;
    startY = height - endY;
    spectrumWidth = (width / 5) * 3;
  };
  //call onResize to set initial values when the object is created
  this.onResize();

  this.addWave = function () {
    let wave = fourier.waveform(1024);
    let outputWave = [];
    let smallScale = 3;
    let bigScale = 40;

    for (let i = 0; i < wave.length; i++) {
      if (i % 20 === 0) {
        let x = map(i, 0, 1024, startX, startX + spectrumWidth);
        if (i < 1024 * 0.25 || i > 1024 * 0.75) {
          let y = map(wave[i], -1, 1, -smallScale, smallScale);
          outputWave.push({
            x: x,
            y: startY + y,
          });
        } else {
          let y = map(wave[i], -1, 1, -bigScale, bigScale);
          outputWave.push({ x: x, y: startY + y });
        }
      }
    }
    outputWaves.push(outputWave);
  };

  let startColour = color(220, 117, 223);
  let endColour = color(87, 26, 195);
  this.draw = function () {
    push();

    strokeWeight(2);
    if (frameCount % params.spaceBetween === 0) {
      this.addWave();
    }
    for (let i = 0; i < outputWaves.length; i++) {
      let outputWave = outputWaves[i];

      stroke(
        map(i, 0, outputWaves.length - 1, red(endColour), red(startColour)),
        map(i, 0, outputWaves.length - 1, green(endColour), green(startColour)),
        map(i, 0, outputWaves.length - 1, blue(endColour), blue(startColour))
      );
      beginShape();
      for (let j = 0; j < outputWave.length; j++) {
        outputWave[j].y -= params.speed;
        vertex(outputWave[j].x, outputWave[j].y);
      }
      endShape();
      if (outputWave[0].y < endY) {
        outputWaves.splice(i, 1);
      }
    }

    noStroke();
    pop();
  };
}
