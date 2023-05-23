
// Create an array to store the audio elements
let audioElements = [];

// Get the drop box and file input elements
let dropBox = document.getElementById('dropBox');
let fileInput = document.getElementById('fileInput');

// Add event listeners for the drag and drop events
dropBox.addEventListener('dragover', function(event) {
    event.preventDefault();
});

dropBox.addEventListener('drop', function(event) {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
});

// Add a click event listener to the drop box
dropBox.addEventListener('click', function() {
    fileInput.click();
});

// Add a change event listener to the file input
fileInput.addEventListener('change', function() {
    handleFiles(this.files);
});

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
            let audio = new Audio(URL.createObjectURL(files[i]));
            audioElements.push(audio);
            addButton(audioElements.length);
        }
    }
}

function addButton(index) {
    let button = document.createElement('button');
    button.textContent = index;
    button.dataset.key = index - 1;
    button.addEventListener('mousedown', function() {
        playSound(index - 1);
    });
    button.addEventListener('mouseup', function() {
        pauseSound(index - 1);
    });
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.className = 'deleteButton';
    deleteButton.addEventListener('click', function() {
        deleteSound(index - 1);
        button.remove();
    });
    button.appendChild(deleteButton);
    document.getElementById('sound-box').appendChild(button);
}

function playSound(index) {
    audioElements[index].play();
}

function pauseSound(index) {
    audioElements[index].pause();
}

function deleteSound(index) {
    audioElements.splice(index, 1);
    let buttons = document.getElementById('sound-box').children;
    for (let i = index; i < buttons.length; i++) {
        buttons[i].textContent = i + 1;
    }
}

// Get master volume slider
let masterVolume = document.getElementById('master-volume');
masterVolume.oninput = function() {
    for (let audio of audioElements) {
        audio.volume = this.value;
    }
};
