// public/soundbox/audioManager.js

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.audioElements = [];
    this.audioSources = new Map();
    this.keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // Default key codes for number keys 1-0
  }

  getAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.7; // Default master volume
      this.masterGain.connect(this.audioContext.destination);
    }
    return this.audioContext;
  }

  populateAudioInputs() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        const audioInputSelect = document.getElementById("audio-input-select");
        audioInputSelect.innerHTML = "";
        audioInputs.forEach((device, index) => {
          const option = document.createElement("option");
          option.value = device.deviceId;
          option.text = device.label || `Microphone ${index + 1}`;
          audioInputSelect.appendChild(option);
        });
      })
      .catch((err) => {
        console.error("Error enumerating devices:", err);
      });
  }

  setAudioInputDevice(deviceId) {
    // Placeholder for setting audio input device if needed
  }

  addAudio(file, callback) {
    if (this.audioElements.length >= 10) {
      alert("Maximum 10 sounds are allowed.");
      return;
    }

    if (!(file instanceof Blob) && !file.type.startsWith("audio/")) {
      alert("Unsupported file type.");
      return;
    }

    const audioURL = URL.createObjectURL(file);
    const audio = new Audio(audioURL);
    audio.loop = false;
    audio.volume = 0.7;
    audio.crossOrigin = "anonymous"; // Enable CORS if needed

    const track = this.getAudioContext().createMediaElementSource(audio);
    track.connect(this.masterGain);

    const id = this.generateUUID();
    audio.id = id;

    this.audioElements.push(audio);
    this.audioSources.set(id, { audio, track, file }); // Store file for waveform

    if (callback) callback(id);
  }

  removeAudio(id) {
    const source = this.audioSources.get(id);
    if (source) {
      source.audio.pause();
      URL.revokeObjectURL(source.audio.src);
      source.audio.src = "";
      source.track.disconnect();
      this.audioSources.delete(id);

      this.audioElements = this.audioElements.filter((a) => a.id !== id);
    }
  }

  playAudio(id) {
    if (this.getAudioContext().state === "suspended") {
      this.getAudioContext().resume();
    }
    const source = this.audioSources.get(id);
    if (source && source.audio.paused) {
      source.audio.play();
    }
  }

  pauseAudio(id) {
    const source = this.audioSources.get(id);
    if (source && !source.audio.paused) {
      source.audio.pause();
      // Only reset currentTime if not looping
      if (!source.audio.loop) {
        source.audio.currentTime = 0;
      }
    }
  }

  toggleLoop(id) {
    const source = this.audioSources.get(id);
    if (source) {
      source.audio.loop = !source.audio.loop;
    }
  }

  setVolume(id, volume) {
    const source = this.audioSources.get(id);
    if (source) {
      source.audio.volume = volume;
    }
  }

  setMasterVolume(volume) {
    if (!this.masterGain) {
      this.getAudioContext(); // Ensure audio context and master gain are initialized
    }
    this.masterGain.gain.value = volume;
  }

  generateUUID() {
    // Simple UUID generator
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
