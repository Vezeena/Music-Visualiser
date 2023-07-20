// constructor function for dancefloor visualisation
function Dancefloor() {
  //vis name
  this.name = "dancefloor (click squares)";
  this.gui = createGui(this.name);

  //object parameters for dancefloor gui (start value, increment, min, max)
  let params = {
    //slider for grid size
    gridSize: 7,
    gridSizeStep: 1,
    gridSizeMin: 1,
    gridSizeMax: 50,
    //drop down menu for different patterns
    pattern: [
      "square",
      "checkered",
      "polka",
      "full",
      "trident",
      "waffle",
      "circle",
    ],
  };
  this.gui.addObject(params);

  //variable for increasing hue to cycle through colours
  let strokeHue = 0;

  this.squareWidth;
  this.squareHeight;

  //array of squares with values set to true
  //values will be changed to false when clicked
  let onSquares = [];
  for (let i = 0; i < params.gridSizeMax; i++) {
    onSquares.push([]);
    for (let j = 0; j < params.gridSizeMax; j++) {
      onSquares[i].push(true);
    }
  }

  this.shouldDrawSquare = function (i, j) {
    if (params.pattern === "full") {
      return true;
    }
    if (params.pattern === "checkered") {
      return (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1);
    }
    if (params.pattern === "waffle") {
      return (i * i) % 2 === 0 || (j * j) % 2 === 0;
    }
    if (params.pattern === "polka") {
      return (i * i) % 2 === 0 && (j * j) % 2 === 0;
    }
    if (params.pattern === "trident") {
      return (
        i === 2 * j || j === 2 * i || i === 4 * j || j === 4 * i || i === j
      );
    }
    if (params.pattern === "square") {
      return (
        (i % 2 === 0 &&
          ((i >= j && i >= params.gridSize - j - 1) ||
            (i <= j && i < params.gridSize - j - 1))) ||
        (j % 2 === 0 &&
          ((j >= i && j >= params.gridSize - i - 1) ||
            (j <= i && j < params.gridSize - i - 1)))
      );
    }
    if (params.pattern === "circle") {
      const center = params.gridSize / 2;
      const distance = Math.round(
        Math.sqrt((center - i) ** 2 + (center - j) ** 2)
      );
      return distance % 3 === 0;
    }
  };

  this.mouseClicked = function () {
    for (let i = 0; i < params.gridSize; i++) {
      for (let j = 0; j < params.gridSize; j++) {
        if (
          mouseX > this.squareWidth * i &&
          mouseX < this.squareWidth * (i + 1) &&
          mouseY > this.squareHeight * j &&
          mouseY < this.squareHeight * (j + 1) &&
          this.shouldDrawSquare(i, j)
        ) {
          onSquares[i][j] = !onSquares[i][j];
        }
      }
    }
  };

  //draw the dancefloor to the screen
  this.draw = function () {
    push();

    this.squareWidth = width / params.gridSize;
    this.squareHeight = height / params.gridSize;

    //increase hue up to 360 and begin again (rainbow effect)
    strokeHue = (strokeHue + 2) % 360;

    //change colour mode for easier rainbow effect
    colorMode(HSL);
    stroke(strokeHue, 70, 50);
    colorMode(RGB);
    strokeWeight(5);

    //analyse sound and separate into 5 different bins for each range
    //get the amplitudes corresponding to each frequency
    fourier.analyze(1024);
    let bassEnergy = fourier.getEnergy("bass");
    let lowMidEnergy = fourier.getEnergy("lowMid");
    let midEnergy = fourier.getEnergy("mid");
    let highMidEnergy = fourier.getEnergy("highMid");
    let trebleEnergy = fourier.getEnergy("treble");

    //want the colours to change with the energy, HSB for brightness
    colorMode(HSB, 255);

    let fillColour = [
      bassEnergy,
      lowMidEnergy,
      midEnergy,
      highMidEnergy,
      trebleEnergy,
    ];

    //create all the grids depending on toggle
    for (let i = 0; i < params.gridSize; i++) {
      for (let j = 0; j < params.gridSize; j++) {
        if (this.shouldDrawSquare(i, j)) {
          //check if onSquare is true, if false dim colour
          if (onSquares[i][j]) {
            fill(fillColour[i % fillColour.length], 255, 255);
          } else {
            fill(fillColour[i % fillColour.length], 255, 50);
          }
          //draw the squares
          rect(
            this.squareWidth * i,
            this.squareHeight * j,
            this.squareWidth,
            this.squareHeight
          );
        }
      }
    }

    //switch back to RGB mode
    colorMode(RGB, 255);
    pop();
  };
}
