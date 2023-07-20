//constructor function for noise visualisation
function Noise() {
  this.name = "noise";
  this.gui = createGui(this.name);

  //rainbow, ROYGBIV in order
  const lineColours = [
    color(255, 0, 0),
    color(255, 127, 0),
    color(255, 255, 0),
    color(0, 255, 0),
    color(0, 0, 255),
    color(75, 0, 130),
    color(148, 0, 211),
  ];

  //object parameters for noise gui (start value, increment, min, max)
  let params = {
    //slider for amount of lines
    lines: 1,
    linesStep: 1,
    linesMin: 1,
    linesMax: lineColours.length,
    //noise slider
    noise: 0.01,
    noiseStep: 0.01,
    noiseMin: 0,
    noiseMax: 1,
    //energy slider
    bassEnergy: 120,
    bassEnergyStep: 1,
    bassEnergyMin: 0,
    bassEnergyMax: 255,
    //length slider
    length: 100,
    lengthStep: 1,
    lengthMin: 0,
    lengthMax: 1000,
    //toggle for 'random' energy (treble)
    useTrebleEnergy: false,
    //treble energy slider
    trebleEnergy: 50,
    trebleEnergyStep: 1,
    trebleEnergyMin: 0,
    trebleEnergyMax: 255,
  };
  this.gui.addObject(params);

  let prog = 0;

  this.draw = function () {
    push();

    if (params.useTrebleEnergy) {
      this.gui.prototype.showControl("trebleEnergy");
    } else {
      this.gui.prototype.hideControl("trebleEnergy");
    }

    //create an array amplitude values from the fft.
    fourier.analyze(1024);
    //get the amplitudes corresponding to bass and treble
    let bassEnergy = fourier.getEnergy("bass");
    let trebleEnergy = fourier.getEnergy("treble");

    strokeWeight(3);

    translate(width / 2, height / 2);

    for (let i = 0; i < params.lines; i++) {
      stroke(lineColours[i]);

      beginShape();
      for (let j = 0; j < params.length; j++) {
        let x = map(
          noise(j * params.noise + prog),
          0,
          1,
          -200 - 100 * i,
          300 + 100 * i
        );
        let y = map(noise(j * params.noise + prog + 1000), 0, 1, -300, 400);

        vertex(x, y);
      }

      endShape();
    }

    if (bassEnergy > params.bassEnergy) {
      prog += 0.03;
    }
    if (params.useTrebleEnergy && trebleEnergy > params.trebleEnergy) {
      noiseSeed();
    }

    pop();
  };
}
