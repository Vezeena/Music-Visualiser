//constructor function for wavepattern visualisation
function WavePattern() {
  //vis name
  this.name = "wavepattern";
  this.gui = createGui(this.name);

  //object parameters for wavepattern gui (array for dropdown menu)
  let params = {
    //slider for strokeWeight
    strokeWeight: 3,
    strokeWeightStep: 1,
    strokeWeightMin: 1,
    strokeWeightMax: 10,

    bins: [1024, 512, 256, 128, 64, 32],
    shape: ["spiral", "line", "circle"],
    //slider for circle radius
    circleRadius: 200,
    circleRadiusStep: 1,
    circleRadiusMin: 50,
    circleRadiusMax: 500,
    //slider for spiral size
    spiralRadius: 400,
    spiralRadiusStep: 1,
    spiralRadiusMin: 100,
    spiralRadiusMax: 1000,
    //slider for spiral loops
    spiralLoops: 3,
    spiralLoopsStep: 1,
    spiralLoopsMin: 1,
    spiralLoopsMax: 10,
  };
  this.gui.addObject(params);

  //draw the wave form to the screen
  this.draw = function () {
    push();
    strokeWeight(params.strokeWeight);

    if (params.shape === "circle") {
      this.gui.prototype.showControl("circleRadius");
    } else {
      this.gui.prototype.hideControl("circleRadius");
    }
    if (params.shape === "spiral") {
      this.gui.prototype.showControl("spiralRadius");
      this.gui.prototype.showControl("spiralLoops");
    } else {
      this.gui.prototype.hideControl("spiralRadius");
      this.gui.prototype.hideControl("spiralLoops");
    }

    beginShape();
    //calculate the waveform from the fft.
    // slice wave because with a small bin size we get a long array with only the first
    // bins positions filled (and the rest are zeros)
    let wave = fourier.waveform(params.bins).slice(0, params.bins);
    // for the circle, to make the points line up nicely, we concatenate the wave with
    // a reversed version of itself, effectively having double the number of points in the wave
    // so choosing 32 bins on the gui will produce 64 points.
    if (params.shape === "circle") {
      wave = wave.concat(wave.slice(0).reverse());
    }
    for (let i = 0; i < wave.length; i++) {
      //hue that changes with wave
      let hue = round(map(wave[i], 0, 1, 150, 360));
      colorMode(HSL);
      stroke(hue, 75, 50);
      colorMode(RGB);

      let x;
      let y;

      if (params.shape === "line") {
        //for each element of the waveform map it to screen
        //coordinates and make a new vertex at the point.
        x = map(i, 0, wave.length - 1, 0, width);
        y = map(wave[i], -1, 1, 0, height);
      } else if (params.shape === "circle") {
        const angle = (TWO_PI / (wave.length - 1)) * i;
        const hypotenuse = map(wave[i], -1, 1, 0, 2 * params.circleRadius);

        x = width / 2 + hypotenuse * cos(angle);
        y = height / 2 + hypotenuse * sin(angle);
      } else if (params.shape === "spiral") {
        const angle = ((TWO_PI * params.spiralLoops) / (wave.length - 1)) * i;
        const radius = map(i, 0, wave.length - 1, 0, params.spiralRadius);
        const hypotenuse = map(wave[i], -1, 1, 0, 2 * radius);

        x = width / 2 + hypotenuse * cos(angle);
        y = height / 2 + hypotenuse * sin(angle);
      }

      vertex(x, y);
    }

    endShape();
    noStroke();
    pop();
  };
}
