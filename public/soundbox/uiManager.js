// public/soundbox/uiManager.js

class UIManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.recording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.currentlyPlaying = new Set();
    this.noiseAudio = null;
    this.rainAudio = null;
    this.tabRecording = false;
    this.tabMediaRecorder = null;
    this.tabRecordedChunks = [];
  }

  initializeGenerators() {
    // Noise Toggle Button
    const noiseToggle = document.getElementById("noise-toggle");
    noiseToggle.addEventListener("click", () => {
      if (!this.noiseAudio) {
        this.initializeNoiseGenerator();
      }
      this.toggleGenerator(this.noiseAudio, noiseToggle);
    });

    // Rain Toggle Button
    const rainToggle = document.getElementById("rain-toggle");
    rainToggle.addEventListener("click", () => {
      if (!this.rainAudio) {
        this.initializeRainGenerator();
      }
      this.toggleGenerator(this.rainAudio, rainToggle);
    });

    // Noise Volume Slider
    document.getElementById("noise-volume").addEventListener("input", (e) => {
      if (this.noiseAudio) {
        this.noiseAudio.volume = parseFloat(e.target.value);
      }
    });

    // Rain Volume Slider
    document.getElementById("rain-volume").addEventListener("input", (e) => {
      if (this.rainAudio) {
        this.rainAudio.volume = parseFloat(e.target.value);
      }
    });
  }

  initializeNoiseGenerator() {
    this.noiseAudio = new Audio("/soundbox/white_noise.mp3");
    this.noiseAudio.loop = true;
    this.noiseAudio.volume = parseFloat(
      document.getElementById("noise-volume").value
    );
    const noiseTrack = this.audioManager
      .getAudioContext()
      .createMediaElementSource(this.noiseAudio);
    noiseTrack.connect(this.audioManager.masterGain);
  }

  initializeRainGenerator() {
    this.rainAudio = new Audio("/soundbox/rain.mp3");
    this.rainAudio.loop = true;
    this.rainAudio.volume = parseFloat(
      document.getElementById("rain-volume").value
    );
    const rainTrack = this.audioManager
      .getAudioContext()
      .createMediaElementSource(this.rainAudio);
    rainTrack.connect(this.audioManager.masterGain);
  }

  toggleGenerator(audio, toggleButton) {
    if (this.audioManager.getAudioContext().state === "suspended") {
      this.audioManager.getAudioContext().resume();
    }
    if (audio.paused) {
      audio.play();
      toggleButton.classList.add("active");
      toggleButton.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      toggleButton.classList.remove("active");
      toggleButton.setAttribute("aria-pressed", "false");
    }
  }

  handleFiles(files) {
    Array.from(files).forEach((file) => {
      this.audioManager.addAudio(file, (id) => {
        this.addSoundButton(id, file.name);
        // Initialize waveform
        this.initializeWaveform(id, file);
      });
    });
  }

  initializeWaveform(id, file) {
    const soundBox = document.getElementById("sound-box");
    const buttonContainer = soundBox.querySelector(`div[data-id='${id}']`);

    const waveformContainer = document.createElement("div");
    waveformContainer.classList.add("waveform-container");

    const waveSurfer = WaveSurfer.create({
      container: waveformContainer,
      waveColor: "violet",
      progressColor: "purple",
      height: 80,
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      waveSurfer.loadBlob(new Blob([e.target.result]));
    };
    reader.readAsArrayBuffer(file);

    // Append waveform to the button container
    buttonContainer.appendChild(waveformContainer);

    // Optionally add trimming controls here
    // ...
  }

  addSoundButton(id, name) {
    const soundBox = document.getElementById("sound-box");

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container", "my-2");
    buttonContainer.setAttribute("data-id", id);

    // Play/Pause Button
    const playButton = document.createElement("button");
    playButton.textContent =
      name || `Sound ${this.audioManager.audioElements.length}`;
    playButton.setAttribute("aria-label", `Play ${name}`);
    playButton.dataset.id = id;
    playButton.classList.add("btn", "btn-outline-primary");

    playButton.addEventListener("mousedown", () => {
      if (this.audioManager.getAudioContext().state === "suspended") {
        this.audioManager.getAudioContext().resume();
      }
      this.audioManager.playAudio(id);
      this.currentlyPlaying.add(id);
      playButton.classList.add("active");
    });

    playButton.addEventListener("mouseup", () => {
      this.audioManager.pauseAudio(id);
      this.currentlyPlaying.delete(id);
      playButton.classList.remove("active");
    });

    playButton.addEventListener("mouseleave", () => {
      if (this.currentlyPlaying.has(id)) {
        this.audioManager.pauseAudio(id);
        this.currentlyPlaying.delete(id);
        playButton.classList.remove("active");
      }
    });

    // Touch Events for Mobile
    playButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (this.audioManager.getAudioContext().state === "suspended") {
        this.audioManager.getAudioContext().resume();
      }
      this.audioManager.playAudio(id);
      this.currentlyPlaying.add(id);
      playButton.classList.add("active");
    });

    playButton.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.audioManager.pauseAudio(id);
      this.currentlyPlaying.delete(id);
      playButton.classList.remove("active");
    });

    // Delete Button
    const deleteButton = document.createElement("span");
    deleteButton.textContent = "×";
    deleteButton.classList.add("delete-button", "ml-2");
    deleteButton.setAttribute("aria-label", `Delete ${name}`);
    deleteButton.tabIndex = 0;

    deleteButton.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        this.audioManager.removeAudio(id);
        soundBox.removeChild(buttonContainer);
      }
    });

    deleteButton.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        deleteButton.click();
      }
    });

    // Volume Slider
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = 0;
    volumeSlider.max = 1;
    volumeSlider.step = 0.01;
    volumeSlider.value =
      this.audioManager.audioElements.find((a) => a.id === id)?.volume || 0.7;
    volumeSlider.classList.add("form-control-range", "my-2");
    volumeSlider.setAttribute("aria-label", `Volume for ${name}`);

    volumeSlider.addEventListener("input", (e) => {
      this.audioManager.setVolume(id, parseFloat(e.target.value));
    });

    // Loop Toggle Button
    const loopButton = document.createElement("button");
    loopButton.textContent = "Loop";
    loopButton.classList.add("btn", "btn-outline-secondary", "ml-2");
    loopButton.setAttribute("aria-pressed", "false");
    loopButton.dataset.id = id;

    loopButton.addEventListener("click", () => {
      this.audioManager.toggleLoop(id);
      const isLooping = this.audioManager.audioSources.get(id).audio.loop;
      loopButton.classList.toggle("active", isLooping);
      loopButton.setAttribute("aria-pressed", isLooping.toString());
    });

    // Append elements to container
    buttonContainer.appendChild(playButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(volumeSlider);
    buttonContainer.appendChild(loopButton);

    soundBox.appendChild(buttonContainer);
  }

  handleKeyDown(e) {
    const index = this.audioManager.keyCodes.indexOf(e.keyCode);
    if (index !== -1 && index < this.audioManager.audioElements.length) {
      const id = this.audioManager.audioElements[index].id;
      if (this.audioManager.getAudioContext().state === "suspended") {
        this.audioManager.getAudioContext().resume();
      }
      this.audioManager.playAudio(id);
      this.currentlyPlaying.add(id);
      this.highlightButton(id, true);
    }
  }

  handleKeyUp(e) {
    const index = this.audioManager.keyCodes.indexOf(e.keyCode);
    if (index !== -1 && index < this.audioManager.audioElements.length) {
      const id = this.audioManager.audioElements[index].id;
      this.audioManager.pauseAudio(id);
      this.currentlyPlaying.delete(id);
      this.highlightButton(id, false);
    }
  }

  highlightButton(id, isActive) {
    const soundBox = document.getElementById("sound-box");
    const buttons = soundBox.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.dataset.id === id) {
        button.classList.toggle("active", isActive);
      }
    });
  }

  startCalibration() {
    alert(
      "After pressing OK, please press each number key in order from 1 to 0."
    );
    this.audioManager.keyCodes = [];
    const storeKeyCode = (e) => {
      if (
        !this.audioManager.keyCodes.includes(e.keyCode) &&
        e.keyCode >= 48 &&
        e.keyCode <= 57
      ) {
        this.audioManager.keyCodes.push(e.keyCode);
      }
      if (this.audioManager.keyCodes.length === 10) {
        window.removeEventListener("keydown", storeKeyCode);
        alert("Calibration complete.");
      }
    };
    window.addEventListener("keydown", storeKeyCode);
  }

  setMasterVolume(volume) {
    this.audioManager.setMasterVolume(volume);
  }

  toggleRecording() {
    if (!this.recording) {
      this.startCountdown(3, this.startRecording.bind(this));
    } else {
      this.stopRecording();
    }
  }

  startCountdown(seconds, callback) {
    const recordButton = document.getElementById("recordButton");
    let currentSeconds = seconds;
    recordButton.disabled = true;
    const countdownInterval = setInterval(() => {
      if (currentSeconds > 0) {
        recordButton.textContent = currentSeconds.toString();
        currentSeconds--;
      } else {
        clearInterval(countdownInterval);
        recordButton.textContent = "Stop Recording";
        recordButton.disabled = false;
        callback();
      }
    }, 1000);
  }

  startRecording() {
    const selectedDeviceId =
      document.getElementById("audio-input-select").value;
    navigator.mediaDevices
      .getUserMedia({
        audio: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : true,
      })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.recording = true;
        document.getElementById("recordButton").textContent = "Stop Recording";

        this.mediaRecorder.ondataavailable = (e) => {
          this.recordedChunks.push(e.data);
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: "audio/webm" });
          this.audioManager.addAudio(blob, (id) => {
            this.addSoundButton(
              id,
              `Recording ${this.audioManager.audioElements.length}`
            );
            // Initialize waveform for recording
            this.initializeWaveform(id, blob);
          });

          this.recordedChunks = [];
          document.getElementById("recordButton").textContent = "Record";
          stream.getTracks().forEach((track) => track.stop());
          this.recording = false;
        };
      })
      .catch((err) => {
        console.error("Error accessing microphone", err);
        alert(
          "Could not access the selected microphone. Please check your permissions and try again."
        );
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
    }
  }

  // New methods for tab audio recording
  toggleTabRecording() {
    if (!this.tabRecording) {
      this.startTabRecording();
    } else {
      this.stopTabRecording();
    }
  }

  startTabRecording() {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true, // Request video as well
      })
      .then((stream) => {
        // Stop the video track since we don't need it
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach((track) => track.stop());

        // Create a new stream with only the audio tracks
        const audioStream = new MediaStream(stream.getAudioTracks());

        this.tabMediaRecorder = new MediaRecorder(audioStream);
        this.tabMediaRecorder.start();
        this.tabRecording = true;
        document.getElementById("recordTabAudioButton").textContent =
          "Stop Tab Recording";

        this.tabMediaRecorder.ondataavailable = (e) => {
          this.tabRecordedChunks.push(e.data);
        };

        this.tabMediaRecorder.onstop = () => {
          const blob = new Blob(this.tabRecordedChunks, { type: "audio/webm" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "tab-audio-recording.webm";
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(a);

          this.tabRecordedChunks = [];
          document.getElementById("recordTabAudioButton").textContent =
            "Record Tab Audio";
          stream.getTracks().forEach((track) => track.stop());
          this.tabRecording = false;
        };
      })
      .catch((err) => {
        console.error("Error accessing tab audio", err);
        alert(
          "Could not access tab audio. Please check your permissions and try again."
        );
      });
  }

  stopTabRecording() {
    if (this.tabMediaRecorder && this.tabRecording) {
      this.tabMediaRecorder.stop();
    }
  }
}
