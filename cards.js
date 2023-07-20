//constructor function for cards visualisation
function Cards() {
  //name of the visualisation
  this.name = "cards";
  this.gui = createGui(this.name);

  //object parameters for cards gui (start value, increment, min, max)
  let params = {
    //colour slider for fade time
    fadeTime: 700,
    fadeTimeStep: 10,
    fadeTimeMin: 0,
    fadeTimeMax: 5000,
    //colour theme
    theme: ["spring", "summer", "autumn", "winter", "rainbow"],
  };
  this.gui.addObject(params);

  //frquencies used by the energyfunction to retrieve a value for each plot.
  this.frequencyBins = ["bass", "lowMid", "mid", "highMid", "treble"];

  //rectangles
  this.rects = [];

  this.drawRect = function (rectangle) {
    fill(
      red(rectangle.colour),
      green(rectangle.colour),
      blue(rectangle.colour),
      map(Date.now() - rectangle.time, 0, params.fadeTime, 255, 0)
    );
    rect(rectangle.x, rectangle.y, 50 * rectangle.size, 75 * rectangle.size);
    noFill();
  };

  // draw the keys to the screen
  this.draw = function () {
    push();
    //create an array amplitude values from the fft.
    fourier.analyze(1024);
    //iterator for selecting frequency bin.
    for (let i = 0; i < this.frequencyBins.length; i++) {
      let bin = this.frequencyBins[i];
      let energy = fourier.getEnergy(bin);
      if (energy === 0) {
        continue;
      }
      let x;
      let y;
      let c;
      let size = map(energy, 0, 255, 0, 1);

      let bassColour;
      let lowMidColour;
      let midColour;
      let highMidColour;
      let trebleColour;

      if (params.theme === "spring") {
        bassColour = color("#4d8");
        lowMidColour = color("#a35");
        midColour = color("#9d5");
        highMidColour = color("#817");
        trebleColour = color("#639");
      } else if (params.theme === "summer") {
        bassColour = color("#ed0");
        lowMidColour = color("#c66");
        midColour = color("#9d5");
        highMidColour = color("#a35");
        trebleColour = color("#e94");
      } else if (params.theme === "autumn") {
        bassColour = color("#e94");
        lowMidColour = color("#c66");
        midColour = color("#a35");
        highMidColour = color("#ed0");
        trebleColour = color("#817");
      } else if (params.theme === "winter") {
        bassColour = color(255);
        lowMidColour = color("#36b");
        midColour = color("#09c");
        highMidColour = color("#0bc");
        trebleColour = color("#2cb");
      } else if (params.theme === "rainbow") {
        bassColour = color("#36b");
        lowMidColour = color("#4d8");
        midColour = color("#ed0 ");
        highMidColour = color("#e94");
        trebleColour = color("#a35");
      }

      if (bin === "bass") {
        c = bassColour;
        x = random(0, width);
        y = random(height - height / 4, height);
      } else if (bin === "lowMid") {
        c = lowMidColour;
        x = random(0, width);
        y = random(height - height / 4, height / 2);
      } else if (bin === "mid") {
        c = midColour;
        x = random(0, width);
        y = random(height / 2 - height / 8, height / 2 + height / 8);
      } else if (bin === "highMid") {
        c = highMidColour;
        x = random(0, width);
        y = random(height / 2, height / 4);
      } else {
        c = trebleColour;
        x = random(0, width);
        y = random(height / 4, 0);
      }

      this.rects.push({ x: x, y: y, time: Date.now(), colour: c, size: size });
    }

    //for loop to draw the keys only when time is less than 3 seconds
    let lastToRemove;
    for (let i = 0; i < this.rects.length; i++) {
      if (Date.now() - this.rects[i].time < params.fadeTime) {
        this.drawRect(this.rects[i]);
      } else {
        lastToRemove = i;
      }
    }
    if (lastToRemove != null) {
      this.rects.splice(0, lastToRemove + 1);
    }

    pop();
  };
}
