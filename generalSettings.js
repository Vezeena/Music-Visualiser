function GeneralSettings() {
  this.gui = createGui("General Settings");
  this.gui.setPosition(
    controls.playbackButton.x + controls.playbackButton.width * 1.5,
    controls.playbackButton.y
  );
  //object parameters for gui including song, background, and visualisation selection
  this.selection = {
    visualisation: [
      "wavepattern",
      "ridge plot",
      "cards",
      "dancefloor (click squares)",
      "fireworks",
      "needles",
      "noise",
      "spectrum",
      "starry sky",
    ],
    song: [
      "Stomper Reggae Bit.mp3",
      "Final Fantasy.mp3",
      "Cocaine Model - Zhu.mp3",
      "Keygen Music Her Numbness.mp3",
      "Tetris.mp3",
      "Communism History.mp3",
      "Badger.mp3",
      "Musik.mp3",
      "Crystals.mp3",
      "Hydrogen.mp3",
      "Perturbator.mp3",
      "Plantasia.wav",
    ],
    background: [
      "Blue Mountains.jpg",
      "Blue Space.jpg",
      "Galaxy.jpg",
      "Nebula.jpg",
      "None.jpg",
      "Space.jpg",
      "Starry.jpg",
      "Stars.jpg",
      "Sunset.jpg",
      "Sunset Mountains.jpg",
      "Add From File",
    ],
  };
  this.gui.addObject(this.selection);
  this.gui.prototype.addFileChooser(
    "customBackground",
    "Choose background...",
    "image/*",
    onCustomImageChange
  );

  /////SOUND/////

  //error callback for soundfile
  function onSoundError(error) {
    alert("error with playback: " + error);
  }

  let currentVisualization = null;

  let currentSound = sound.file;

  //success callback for soundfile
  function onSoundSuccess(loadedSound) {
    if (loadedSound.file != currentSound) {
      return;
    }
    sound.stop();
    //stop the music then make sound the newly loaded song
    sound = loadedSound;
    if (controls.playbackButton.playing) {
      sound.loop();
    }
  }

  /////BACKGROUND/////

  //error and success callback for background image
  function onImageError(error) {
    alert("error with background selected: " + error);
  }

  let currentImage = backgroundImage;

  function onImageSuccess(loadedImage) {
    //make the background image the newly loaded image file
    backgroundImage = loadedImage;
  }

  //image file selected
  let customImage = null;

  // load the image once a custom image is selected
  function onCustomImageChange(file) {
    // Inspiration from p5.js source code
    p5.File._load(file, loadImageFile);
  }
  function loadImageFile(file) {
    // Inspiration from https://p5js.org/reference/#/p5/createFileInput
    if (file.type === "image") {
      customImage = createImg(file.data, "");
    } else {
      customImage = null;
    }
  }

  this.draw = function () {
    push();

    if (currentVisualization !== generalSettings.selection.visualisation) {
      currentVisualization = generalSettings.selection.visualisation;
      vis.selectVisual(currentVisualization);
    }

    //gui selected song with file path
    const selectedSound = "assets/" + this.selection.song;
    if (selectedSound !== currentSound) {
      currentSound = selectedSound;
      //call the loadsound function to load the selected song
      loadSound(selectedSound, onSoundSuccess, onSoundError);
    }

    //gui selected background with file path
    if (this.selection.background !== "Add From File") {
      this.gui.prototype.hideControl("customBackground");

      const selectedImage = "assets/" + this.selection.background;
      if (selectedImage !== currentImage) {
        currentImage = selectedImage;
        //call the loadimage function to load the selected background
        loadImage(selectedImage, onImageSuccess, onImageError);
      }
    } else {
      this.gui.prototype.showControl("customBackground");

      currentImage = null;
      backgroundImage = customImage;
    }

    pop();
  };
}
