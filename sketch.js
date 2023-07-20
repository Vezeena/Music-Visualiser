//global for the controls and input
let controls = null;
//store visualisations in a container
let vis = null;
//variable for the p5 sound object
let sound = null;
//variable for the p5 image object
let backgroundImage;
//variable for p5 fast fourier transform
let fourier;
//variable for amplitude
let amplitude;
//variable for the gui
let gui;
//variable for loading song
let isLoading = false;
// number returned by loadsound: while loading
let loadingProgress;
//general settings controlling background, sound, and visualisation choices
let generalSettings;

function preload() {
  soundFormats("mp3", "wav");
  sound = loadSound("assets/Stomper Reggae Bit.mp3");
  backgroundImage = loadImage("assets/Blue Mountains.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  controls = new ControlsAndInput();

  generalSettings = new GeneralSettings();

  //instantiate the fft object
  fourier = new p5.FFT();

  //instantiate the amplitude object
  amplitude = new p5.Amplitude();

  //create a new visualisation container and add visualisations
  vis = new Visualisations();
  vis.add(new Spectrum());
  vis.add(new WavePattern());
  vis.add(new Needles());
  vis.add(new StarrySky());
  vis.add(new Cards());
  vis.add(new RidgePlot());
  vis.add(new Noise());
  vis.add(new Fireworks());
  vis.add(new Dancefloor());
}

function draw() {
  //setting backgroud to 0 to refresh it
  background(0);
  //using the p5.js image function to cover the canvas with the image
  //without distorting it.
  // https://p5js.org/reference/#/p5/image

  if (backgroundImage != null) {
    image(
      backgroundImage,
      0,
      0,
      width,
      height,
      0,
      0,
      backgroundImage.width,
      backgroundImage.height,
      COVER
    );
  }

  generalSettings.draw();

  //draw the selected visualisation
  vis.selectedVisual.draw();
  //draw the controls on top.
  controls.draw();
}

function mouseClicked() {
  if (!controls.mouseClicked()) {
    vis.selectedVisual.mouseClicked?.();
  }
}

function doubleClicked() {
  vis.selectedVisual.doubleClicked?.();
  controls.doubleClicked();
}

function keyPressed() {
  vis.selectedVisual.keyPressed?.();
  return controls.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit
//if the visualisation needs to be resized call its onResize method
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  vis.selectedVisual.onResize?.();
}
