// public/soundbox/soundbox.js

(function () {
  // Initialize Managers
  const audioManager = new AudioManager();
  const uiManager = new UIManager(audioManager);

  // Initialize Generators
  uiManager.initializeGenerators();

  // Home button functionality
  document.getElementById("homeButton").addEventListener("click", () => {
    window.location.href = "/";
  });

  // Sound pack button functionality
  document.getElementById("soundPackButton").addEventListener("click", () => {
    window.open(
      "https://www.mediafire.com/file/ppgtly6e6ddzpsz/COUCH_KIT_VOL._1.zip/file",
      "_blank"
    );
  });

  // Record button functionality
  document.getElementById("recordButton").addEventListener("click", () => {
    uiManager.toggleRecording();
  });

  // Record Tab Audio button functionality
  document
    .getElementById("recordTabAudioButton")
    .addEventListener("click", () => {
      uiManager.toggleTabRecording();
    });

  // Handle file drop
  const dropBox = document.getElementById("dropBox");
  dropBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropBox.classList.add("active");
  });
  dropBox.addEventListener("dragleave", () => {
    dropBox.classList.remove("active");
  });
  dropBox.addEventListener("drop", (e) => {
    e.preventDefault();
    dropBox.classList.remove("active");
    uiManager.handleFiles(e.dataTransfer.files);
  });
  dropBox.addEventListener("click", () => {
    document.getElementById("fileInput").click();
  });
  document.getElementById("fileInput").addEventListener("change", (e) => {
    uiManager.handleFiles(e.target.files);
  });
  dropBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      document.getElementById("fileInput").click();
    }
  });

  // Handle calibration
  document.getElementById("calibrationButton").addEventListener("click", () => {
    uiManager.startCalibration();
  });

  // Handle master volume
  document.getElementById("master-volume").addEventListener("input", (e) => {
    uiManager.setMasterVolume(parseFloat(e.target.value));
  });

  // Handle audio input selection
  document
    .getElementById("audio-input-select")
    .addEventListener("change", (e) => {
      audioManager.setAudioInputDevice(e.target.value);
    });

  // Keyboard controls
  window.addEventListener("keydown", (e) => {
    uiManager.handleKeyDown(e);
  });
  window.addEventListener("keyup", (e) => {
    uiManager.handleKeyUp(e);
  });

  // Initial population of audio inputs
  audioManager.populateAudioInputs();

  // Re-populate audio inputs when devices change
  navigator.mediaDevices.addEventListener("devicechange", () => {
    audioManager.populateAudioInputs();
  });
})();
