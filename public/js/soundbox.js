let audioElements = [];
let keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // Default key codes for number keys 1-0

// Home button functionality
document.getElementById("homeButton").addEventListener("click", function () {
    window.location.href = '/';
});

// Sound pack button functionality
document.getElementById("soundPackButton").addEventListener("click", function () {
    window.open("https://www.mediafire.com/file/ppgtly6e6ddzpsz/COUCH_KIT_VOL._1.zip/file");
});

// Record button functionality
document.getElementById("recordButton").addEventListener("click", function () {
    window.open("https://chrome.google.com/webstore/detail/sample/kpkcennohgffjdgaelocingbmkjnpjgc");
});

// Handle file drop
let dropBox = document.getElementById('dropBox');
dropBox.addEventListener('dragover', function (e) {
    e.preventDefault();
});
dropBox.addEventListener('drop', function (e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});
dropBox.addEventListener('click', function () {
    document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function (e) {
    handleFiles(e.target.files);
});

// Handle file selection
function handleFiles(files) {
    if (audioElements.length + files.length > 10) {
        alert("Maximum 10 sounds are allowed.");
        return;
    }
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
            let audio = new Audio(URL.createObjectURL(files[i]));
            audio.loop = true; // Ensure audio loops by default
            audioElements.push(audio);
            addButton(audioElements.length - 1);
        }
    }
}

// Add button for audio element with delete functionality
function addButton(index) {
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    let button = document.createElement('button');
    button.textContent = index + 1;
    button.dataset.key = index;
    button.addEventListener('mousedown', function () {
        playSound(button.dataset.key);
    });
    button.addEventListener('mouseup', function () {
        pauseSound(button.dataset.key);
    });

    let deleteButton = document.createElement('span');
    deleteButton.textContent = '×';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function () {
        deleteSound(index);
    });

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(deleteButton);
    document.getElementById('sound-box').appendChild(buttonContainer);
}

// Delete sound
function deleteSound(index) {
    audioElements[index].pause();
    audioElements.splice(index, 1);
    updateButtons();
}

// Update buttons after deletion
function updateButtons() {
    let soundBox = document.getElementById('sound-box');
    soundBox.innerHTML = '';
    audioElements.forEach((_, index) => addButton(index));
}

function playSound(index) {
    if (audioElements[index].paused) {
        audioElements[index].play();
    }
}

function pauseSound(index) {
    if (!audioElements[index].paused) {
        audioElements[index].pause();
        audioElements[index].currentTime = 0; // Reset audio to start
    }
}

window.addEventListener('keydown', function (e) {
    if (keyCodes.includes(e.keyCode)) {
        playSound(keyCodes.indexOf(e.keyCode));
    }
});

window.addEventListener('keyup', function (e) {
    if (keyCodes.includes(e.keyCode)) {
        pauseSound(keyCodes.indexOf(e.keyCode));
    }
});

// Handle calibration
document.getElementById('calibrationButton').addEventListener('click', function () {
    alert('After pressing OK \nPress each key in order, starting with 1 and ending with 0.\n Don\'t be slow!');
    keyCodes = [];
    window.addEventListener('keydown', storeKeyCode);
});

function storeKeyCode(e) {
    if (!keyCodes.includes(e.keyCode)) {
        keyCodes.push(e.keyCode);
    }
    if (keyCodes.length === 10) {
        window.removeEventListener('keydown', storeKeyCode);
        alert('Calibration complete.');
    }
}

// Handle master volume
document.getElementById('master-volume').addEventListener('input', function (e) {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].volume = e.target.value;
    }
});
