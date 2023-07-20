//constructor function for spectrum visualisation
function Spectrum() {
  this.name = "spectrum";
  this.gui = createGui(this.name);

  //object parameters for spectrum gui (start value, increment, min, max)
  //booleans for toggles
  let params = {
    //toggle for left
    left: false,
    //toggle for bottom
    bottom: true,
    //toggle for right
    right: false,
    //toggle for top
    top: false,
    //toggle for rainbow
    rainbow: false,
    //colour slider rainbow speed
    rainbowSpeed: 2,
    rainbowSpeedStep: 0.1,
    rainbowSpeedMin: 0.1,
    rainbowSpeedMax: 50,
    //colour slider red boost
    redBoost: 0,
    redBoostStep: 1,
    redBoostMin: 0,
    redBoostMax: 255,
    //colour slider green
    greenBoost: 0,
    greenBoostStep: 1,
    greenBoostMin: 0,
    greenBoostMax: 255,
    //colour slider blue
    blueBoost: 0,
    blueBoostStep: 1,
    blueBoostMin: 0,
    blueBoostMax: 255,
  };
  this.gui.addObject(params);

  //variable for increasing hue to cycle through colours
  let spectrumHue = 0;

  this.draw = function () {
    push();

    if (params.rainbow) {
      this.gui.prototype.hideControl("redBoost");
      this.gui.prototype.hideControl("greenBoost");
      this.gui.prototype.hideControl("blueBoost");
      this.gui.prototype.showControl("rainbowSpeed");
    } else {
      this.gui.prototype.showControl("redBoost");
      this.gui.prototype.showControl("greenBoost");
      this.gui.prototype.showControl("blueBoost");
      this.gui.prototype.hideControl("rainbowSpeed");
    }

    let spectrum = fourier.analyze(1024);

    //increase hue up to 360 and begin again (rainbow effect)
    spectrumHue = (spectrumHue + params.rainbowSpeed) % 360;

    for (let i = 0; i < spectrum.length; i++) {
      if (params.rainbow) {
        //change colour mode for easier rainbow effect
        colorMode(HSL);
        fill(spectrum[i] + spectrumHue, 70, 50);
        colorMode(RGB);
      } else {
        //colour + gui slider boost
        fill(
          spectrum[i] + params.redBoost,
          255 - spectrum[i] + params.greenBoost,
          0 + params.blueBoost
        );
      }

      let x = map(i, 0, spectrum.length, 0, width);
      let y = map(i, 0, spectrum.length, 0, height);
      let w = map(spectrum[i], 0, 255, 0, width);
      let h = -height + map(spectrum[i], 0, 255, height, 0);

      if (params.left) {
        //left side vertical
        rect(0, y, w, height / spectrum.length);
      }

      if (params.bottom) {
        //bottom horizontal
        rect(x, height, width / spectrum.length, h);
      }

      if (params.right) {
        //right side vertical
        rect(width, height - y, -w, -height / spectrum.length);
      }

      if (params.top) {
        //top horizontal
        rect(width - x, 0, -width / spectrum.length, -h);
      }

      noFill();
    }

    pop();
  };
}
