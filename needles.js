//constructor function for needles on sound dials visualisation
function Needles() {
  //name of the visualisation
  this.name = "needles";
  this.gui = createGui(this.name);

  let params = {
    expandCentre: false,
  };
  this.gui.addObject(params);

  //how large is the arc of the needle plot.
  let minAngle = PI;
  let maxAngle = 3 * PI;

  this.plotsAcross = 2;
  this.plotsDown = 2;

  //frquencies used by the energyfunction to retrieve a value for each plot
  this.frequencyBins = ["bass", "lowMid", "highMid", "treble"];

  //resize the plots sizes when the screen is resized.
  this.onResize = function () {
    this.pad = width / 20;
    this.plotWidth = (width - this.pad) / this.plotsAcross;
    this.plotHeight = (height - this.pad) / this.plotsDown;
    this.dialRadius = (this.plotWidth - this.pad) / 5 - 5;
  };
  //call onResize to set initial values when the object is created
  this.onResize();

  // draw the plots to the screen
  this.draw = function () {
    //create an array amplitude values from the fft.
    fourier.analyze(1024);
    //iterator for selecting frequency bin.
    this.currentBin = 0;
    push();
    //inner dial colour
    fill("#7B68EE");
    //nested for loop to place plots in 2*2 grid.
    for (let i = 0; i < this.plotsDown; i++) {
      for (let j = 0; j < this.plotsAcross; j++) {
        //calculate the size of the plots
        let x = this.pad + j * this.plotWidth;
        let y = this.pad + i * this.plotHeight;
        let w = this.plotWidth - this.pad;
        let h = this.plotHeight - this.pad;

        //draw an ellipse at that location and size (circle of each dial)
        //outer dial colour (outline)
        stroke("#4B0082");
        strokeWeight(5);
        ellipse(x + w / 2, y + h - w / 4, (w + h) / 3);
        strokeWeight(1);
        noStroke();

        let energy = fourier.getEnergy(this.frequencyBins[this.currentBin]);

        //add the needle
        strokeWeight(2);
        this.needle(energy, x + w / 2, y + h - w / 4);

        //add on the ticks
        this.ticks(
          x + w / 2,
          y + h - w / 4,
          this.frequencyBins[this.currentBin]
        );
        noStroke();

        this.currentBin++;
      }
    }
    noFill();
    pop();
  };

  /*
   *draws a needle to an individual plot
   *@param energy: The energy for the current frequency
   *@param centreX: central x coordinate of the plot rectangle
   *@param bottomY: The bottom y coordinate of the plot rectangle
   */
  this.needle = function (energy, centreX, bottomY) {
    push();
    //needle colour
    stroke("#ccff66");
    //translate so 0 is at the bottom of the needle
    translate(centreX, bottomY);
    //map the energy to the angle for the plot
    theta = map(energy, 0, 255, minAngle, maxAngle);
    //calculate x and y coorindates from angle for the length of needle
    let x = this.dialRadius * cos(theta);
    let y = this.dialRadius * sin(theta);
    //draw the needle
    line(0, 0, x, y);
    noStroke();
    pop();
  };

  /*
   *draw the graph ticks on an individual plot
   *@param centreX: central x coordinate of the plot rectangle
   *@param bottomY: The bottom y coordinate of the plot rectangle
   *@param freqLabel: Label denoting the frequency of the plot
   */
  this.ticks = function (centreX, bottomY, freqLabel) {
    // 20  ticks from pi to 3pi (going backwards)
    let nextTickAngle = minAngle;
    push();
    stroke("#333333");
    translate(centreX, bottomY);
    //draw the circle for the botttom of the needle
    colorMode(HSB, 255);
    let x = fourier.getEnergy(this.frequencyBins[this.currentBin]);
    fill(x, 255, 255);

    if (params.expandCentre) {
      ellipse(0, 0, x);
    } else {
      ellipse(0, 0, 20);
    }
    colorMode(RGB, 255);

    noStroke();
    fill("#ccff66");
    textAlign(CENTER);
    textSize(15);
    text(freqLabel, 0, -this.plotHeight / 5);
    stroke("#333333");

    for (let i = 0; i < 20; i++) {
      //for each tick work out the start and end coordinates of
      //based on its angle from the needle's origin.
      let x = this.dialRadius * cos(nextTickAngle);
      let x1 = (this.dialRadius - 5) * cos(nextTickAngle);

      let y = this.dialRadius * sin(nextTickAngle);
      let y1 = (this.dialRadius - 5) * sin(nextTickAngle);

      line(x, y, x1, y1);
      nextTickAngle += PI / 10;
    }

    noStroke();
    noFill();
    pop();
  };
}
