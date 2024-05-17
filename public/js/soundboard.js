let audioElements = {};
let keyCodes = {}; // This will map key codes to audio elements
let audioContext;

document.body.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("AudioContext created");
    } else if (audioContext.state === 'suspended') {
        audioContext.resume();
        console.log("AudioContext resumed");
    }
});

// Key labels for QWERTY layout
const keys = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
];

// Home button functionality
document.getElementById("homeButton").addEventListener("click", function () {
    window.location.href = "/";
    console.log("Home button clicked");
});

// Sound pack button functionality
document.getElementById("soundPackButton").addEventListener("click", function () {
    window.open("https://www.mediafire.com/file/ppgtly6e6ddzpsz/COUCH_KIT_VOL._1.zip/file");
    console.log("Sound pack button clicked");
});

// Record button functionality
document.getElementById("recordButton").addEventListener("click", function () {
    window.open("https://chrome.google.com/webstore/detail/sample/kpkcennohgffjdgaelocingbmkjnpjgc");
    console.log("Record button clicked");
});

// Create soundboard layout
const soundboard = document.querySelector('.soundboard');
keys.forEach(key => {
    const keyContainer = document.createElement('div');
    keyContainer.classList.add('key-container');
    keyContainer.id = `key-${key}`;

    const keyLabel = document.createElement('div');
    keyLabel.classList.add('key');
    keyLabel.textContent = key;

    const addButton = document.createElement('button');
    addButton.classList.add('add-button');
    addButton.textContent = '+';
    addButton.addEventListener('click', () => addSound(key));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = '×';
    deleteButton.style.display = 'none';
    deleteButton.addEventListener('click', () => deleteSound(key));

    keyContainer.appendChild(keyLabel);
    keyContainer.appendChild(addButton);
    keyContainer.appendChild(deleteButton);
    soundboard.appendChild(keyContainer);

    // Add drag-and-drop functionality to keyContainer
    keyContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        keyContainer.classList.add('drag-over');
    });

    keyContainer.addEventListener('dragleave', function() {
        keyContainer.classList.remove('drag-over');
    });

    keyContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        keyContainer.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files, key);
        }
    });
});

function handleFiles(files, key) {
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
        const audio = new Audio(URL.createObjectURL(files[0]));
        audio.loop = true;
        audioElements[key] = audio;
        keyCodes[key.charCodeAt(0)] = key;
        document.querySelector(`#key-${key} .delete-button`).style.display = 'inline-block';
        console.log(`Audio file loaded for key ${key}`);
    }
}

function addSound(key) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            const audio = new Audio(URL.createObjectURL(e.target.files[0]));
            audio.loop = true;
            audioElements[key] = audio;
            keyCodes[key.charCodeAt(0)] = key;
            document.querySelector(`#key-${key} .delete-button`).style.display = 'inline-block';
            console.log(`Audio file added for key ${key}`);
        }
    });
    fileInput.click();
}

function deleteSound(key) {
    if (audioElements[key]) {
        audioElements[key].pause();
        delete audioElements[key];
        delete keyCodes[key.charCodeAt(0)];
        document.querySelector(`#key-${key} .delete-button`).style.display = 'none';
        console.log(`Audio file deleted for key ${key}`);
    }
}

function playSound(key) {
    if (audioElements[key] && audioElements[key].paused) {
        audioElements[key].play();
        console.log(`Playing sound for key ${key}`);
    }
}

function pauseSound(key) {
    if (audioElements[key] && !audioElements[key].paused) {
        audioElements[key].pause();
        audioElements[key].currentTime = 0;
        console.log(`Paused sound for key ${key}`);
    }
}

window.addEventListener('keydown', function (e) {
    if (keyCodes[e.keyCode]) {
        playSound(keyCodes[e.keyCode]);
        document.getElementById(`key-${keyCodes[e.keyCode]}`).classList.add('active');
        console.log(`Key down: ${keyCodes[e.keyCode]}`);
    }
});

window.addEventListener('keyup', function (e) {
    if (keyCodes[e.keyCode]) {
        pauseSound(keyCodes[e.keyCode]);
        document.getElementById(`key-${keyCodes[e.keyCode]}`).classList.remove('active');
        console.log(`Key up: ${keyCodes[e.keyCode]}`);
    }
});

// Handle calibration
document.getElementById('calibrationButton').addEventListener('click', function () {
    alert('After pressing OK, please press each key in the order displayed. \nMake sure to press the keys quickly.');
    keyCodes = {};
    window.addEventListener('keydown', storeKeyCode);
    console.log("Calibration started");
});

function storeKeyCode(e) {
    const key = String.fromCharCode(e.keyCode);
    if (!keyCodes[e.keyCode] && keys.includes(key)) {
        keyCodes[e.keyCode] = key;
        console.log(`Key code stored: ${key}`);
    }
    if (Object.keys(keyCodes).length === keys.length) {
        window.removeEventListener('keydown', storeKeyCode);
        alert('Calibration complete.');
        console.log("Calibration complete");
    }
}

// Handle master volume
document.getElementById('master-volume').addEventListener('input', function (e) {
    for (let key in audioElements) {
        audioElements[key].volume = e.target.value;
    }
    console.log(`Master volume changed: ${e.target.value}`);
});
