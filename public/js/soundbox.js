//soundbox.js
let audioElements = [];
let keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // Default key codes for number keys 1-0

// Initialize noise and rain generators
let noiseAudio = new Audio("/soundbox/white_noise.mp3"); // Updated path
noiseAudio.loop = true;
noiseAudio.volume = 0.5;

let rainAudio = new Audio("/soundbox/rain.mp3"); // Updated path
rainAudio.loop = true;
rainAudio.volume = 0.5;

// Home button functionality
document.getElementById("homeButton").addEventListener("click", function () {
  window.location.href = "/";
});

// Sound pack button functionality
document
  .getElementById("soundPackButton")
  .addEventListener("click", function () {
    window.open(
      "https://www.mediafire.com/file/ppgtly6e6ddzpsz/COUCH_KIT_VOL._1.zip/file"
    );
  });

// Record button functionality (updated to implement in-app recording)
document.getElementById("recordButton").addEventListener("click", function () {
  toggleRecording();
});

// Handle file drop
let dropBox = document.getElementById("dropBox");
dropBox.addEventListener("dragover", function (e) {
  e.preventDefault();
});
dropBox.addEventListener("drop", function (e) {
  e.preventDefault();
  handleFiles(e.dataTransfer.files);
});
dropBox.addEventListener("click", function () {
  document.getElementById("fileInput").click();
});
document.getElementById("fileInput").addEventListener("change", function (e) {
  handleFiles(e.target.files);
});

// Handle file selection
function handleFiles(files) {
  if (audioElements.length + files.length > 10) {
    alert("Maximum 10 sounds are allowed.");
    return;
  }
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.startsWith("audio/")) {
      let audio = new Audio(URL.createObjectURL(files[i]));
      audio.loop = false; // Default not looping
      audio.volume = 0.7; // Default volume
      audioElements.push(audio);
      addButton(audioElements.length - 1);
    }
  }
}

// Add button for audio element with delete, volume and loop functionalities
function addButton(index) {
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  // Play/Pause Button
  let button = document.createElement("button");
  button.textContent = index + 1;
  button.dataset.key = index;
  button.addEventListener("mousedown", function () {
    playSound(button.dataset.key);
  });
  button.addEventListener("mouseup", function () {
    pauseSound(button.dataset.key);
  });
  button.addEventListener("touchstart", function (e) {
    e.preventDefault();
    playSound(button.dataset.key);
  });
  button.addEventListener("touchend", function (e) {
    e.preventDefault();
    pauseSound(button.dataset.key);
  });

  // Delete Button
  let deleteButton = document.createElement("span");
  deleteButton.textContent = "×";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    deleteSound(index);
  });

  // Volume Slider
  let volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.value = audioElements[index].volume;
  volumeSlider.classList.add("sound-volume-slider");
  volumeSlider.addEventListener("input", function () {
    audioElements[index].volume = this.value;
  });

  // Loop Toggle Button
  let loopButton = document.createElement("button");
  loopButton.textContent = "Loop";
  loopButton.classList.add("loop-button");
  loopButton.dataset.index = index;
  loopButton.addEventListener("click", function () {
    toggleLoop(index, loopButton);
  });

  // Append elements to container
  buttonContainer.appendChild(button);
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(volumeSlider);
  buttonContainer.appendChild(loopButton);

  document.getElementById("sound-box").appendChild(buttonContainer);
}

// Delete sound
function deleteSound(index) {
  audioElements[index].pause();
  audioElements[index].src = ""; // Release the object URL
  audioElements.splice(index, 1);
  updateButtons();
}

// Update buttons after deletion
function updateButtons() {
  let soundBox = document.getElementById("sound-box");
  soundBox.innerHTML = "";
  audioElements.forEach((_, index) => addButton(index));
}

// Play sound
function playSound(index) {
  index = parseInt(index);
  if (audioElements[index].paused) {
    audioElements[index].play();
  }
}

// Pause sound
function pauseSound(index) {
  index = parseInt(index);
  if (!audioElements[index].paused) {
    audioElements[index].pause();
    audioElements[index].currentTime = 0; // Reset audio to start
  }
}

// Toggle loop for a sound
function toggleLoop(index, loopButton) {
  index = parseInt(index);
  if (!audioElements[index].loop) {
    audioElements[index].loop = true;
    playSound(index); // Start playing if not already
    loopButton.classList.add("active");
  } else {
    audioElements[index].loop = false;
    pauseSound(index); // Stop playing
    loopButton.classList.remove("active");
  }
}

// Keyboard controls
window.addEventListener("keydown", function (e) {
  if (keyCodes.includes(e.keyCode)) {
    let index = keyCodes.indexOf(e.keyCode);
    playSound(index);
  }
});
window.addEventListener("keyup", function (e) {
  if (keyCodes.includes(e.keyCode)) {
    let index = keyCodes.indexOf(e.keyCode);
    pauseSound(index);
  }
});

// Handle calibration
document
  .getElementById("calibrationButton")
  .addEventListener("click", function () {
    alert(
      "After pressing OK \nPress each key in order, starting with 1 and ending with 0.\n Don't be slow!"
    );
    keyCodes = [];
    window.addEventListener("keydown", storeKeyCode);
  });

function storeKeyCode(e) {
  if (!keyCodes.includes(e.keyCode) && e.keyCode >= 48 && e.keyCode <= 57) {
    // Ensure number keys
    keyCodes.push(e.keyCode);
  }
  if (keyCodes.length === 10) {
    window.removeEventListener("keydown", storeKeyCode);
    alert("Calibration complete.");
  }
}

// Handle master volume
document
  .getElementById("master-volume")
  .addEventListener("input", function (e) {
    let masterVolume = parseFloat(e.target.value);
    audioElements.forEach((audio) => {
      audio.volume = masterVolume;
    });
    // Also adjust noise and rain volumes
    noiseAudio.volume = masterVolume;
    rainAudio.volume = masterVolume;
  });

// Mobile virtual number pad removal (code removed)

// Add noise generator controls
document.getElementById("noise-toggle").addEventListener("click", function () {
  toggleNoise();
});
document.getElementById("noise-volume").addEventListener("input", function () {
  noiseAudio.volume = this.value;
});

// Add rain generator controls
document.getElementById("rain-toggle").addEventListener("click", function () {
  toggleRain();
});
document.getElementById("rain-volume").addEventListener("input", function () {
  rainAudio.volume = this.value;
});

function toggleNoise() {
  if (noiseAudio.paused) {
    noiseAudio.play();
    document.getElementById("noise-toggle").classList.add("active");
  } else {
    noiseAudio.pause();
    document.getElementById("noise-toggle").classList.remove("active");
  }
}

function toggleRain() {
  if (rainAudio.paused) {
    rainAudio.play();
    document.getElementById("rain-toggle").classList.add("active");
  } else {
    rainAudio.pause();
    document.getElementById("rain-toggle").classList.remove("active");
  }
}

// Recording functionality with audio input selection
let mediaRecorder;
let recordedChunks = [];

// Populate audio input devices
const audioInputSelect = document.getElementById("audio-input-select");

function populateAudioInputs() {
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices) {
      const audioInputs = devices.filter(
        (device) => device.kind === "audioinput"
      );
      audioInputSelect.innerHTML = "";
      audioInputs.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text =
          device.label || `Microphone ${audioInputSelect.length + 1}`;
        audioInputSelect.appendChild(option);
      });
    })
    .catch(function (err) {
      console.error("Error enumerating devices:", err);
    });
}

// Call populateAudioInputs on page load
populateAudioInputs();

// Re-populate audio inputs when devices change
navigator.mediaDevices.ondevicechange = populateAudioInputs;

function toggleRecording() {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    startRecording();
  } else if (mediaRecorder.state === "recording") {
    stopRecording();
  }
}

function startRecording() {
  const selectedDeviceId = audioInputSelect.value;
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
      },
    })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      document.getElementById("recordButton").textContent = "Stop Recording";
      mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = function () {
        let blob = new Blob(recordedChunks, { type: "audio/webm" });
        let audioURL = URL.createObjectURL(blob);
        let audio = new Audio(audioURL);
        audio.loop = false;
        audio.volume = 0.7;
        audioElements.push(audio);
        addButton(audioElements.length - 1);
        recordedChunks = [];
        document.getElementById("recordButton").textContent = "Record";
        stream.getTracks().forEach((track) => track.stop());
      };
    })
    .catch((err) => {
      console.error("Error accessing microphone", err);
      alert("Could not access the selected microphone.");
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
}
