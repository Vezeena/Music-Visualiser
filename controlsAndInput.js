//Constructor function to handle the onscreen menu, keyboard and mouse
function ControlsAndInput() {
  this.menuDisplayed = false;
  //variable for increasing hue to cycle through colours
  let textHue = 0;

  //playback button displayed in the top left of the screen
  this.playbackButton = new PlaybackButton();

  this.togglePlay = function () {
    this.playbackButton.playing = !this.playbackButton.playing;
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  };

  //make the window fullscreen or revert to windowed
  this.mouseClicked = function () {
    //check if the playback button has been clicked
    //if it has, change the playback button icon and start music
    if (this.playbackButton.hitCheck()) {
      this.togglePlay();
      return true;
    }
  };

  //if mouse is not on the button and is double clicked
  //make the visualisation fullscreen or not
  this.doubleClicked = function () {
    if (!this.playbackButton.hitCheck()) {
      fullscreen(!fullscreen());
    }
  };

  //responds to keyboard presses
  //@param keycode the ascii code of the keypressed
  this.keyPressed = function (keycode) {
    if (keycode == 32) {
      this.togglePlay();
    }
  };

  //draws the playback button and potentially the menu
  this.draw = function () {
    push();

    //increase hue up to 360 and begin again (rainbow effect)
    textHue = (textHue + 2) % 360;

    //change colour mode for easier rainbow effect
    colorMode(HSL);
    fill(textHue, 70, 50);
    colorMode(RGB);

    stroke("black");
    strokeWeight(2);
    textSize(34);

    //playback button
    this.playbackButton.draw();

    if (!this.playbackButton.playing) {
      textAlign(CENTER, CENTER);
      text("Press space or click play to start", width / 2, height / 2);
    }

    pop();
    noFill();
    noStroke();
  };
}
