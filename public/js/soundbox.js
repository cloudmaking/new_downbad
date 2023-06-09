// JavaScript (soundbox.js)

let audioElements = [];
let keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // Default key codes for number keys 1-0

//make it so the home button takes you to the home page
document.getElementById("homeButton").addEventListener("click", function(){
    window.location.href = "index.html";
});

// make soundPackButton this button go to a link in a new tab
document.getElementById("soundPackButton").addEventListener("click", function(){
    window.open("https://www.mediafire.com/file/ppgtly6e6ddzpsz/COUCH_KIT_VOL._1.zip/file");
});

// make recordButton this button go to a link in a new tab
document.getElementById("recordButton").addEventListener("click", function(){
    window.open("https://chrome.google.com/webstore/detail/sample/kpkcennohgffjdgaelocingbmkjnpjgc");
});

// Handle file drop
let dropBox = document.getElementById('dropBox');
dropBox.addEventListener('dragover', function(e) {
    e.preventDefault();
});
dropBox.addEventListener('drop', function(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});
dropBox.addEventListener('click', function() {
    document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', function(e) {
    handleFiles(e.target.files);
});

// Handle file selection
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('audio/')) {
            let audio = new Audio(URL.createObjectURL(files[i]));
            audioElements.push(audio);
            addButton(audioElements.length);
        }
    }
}

// Add button for audio element
function addButton(index) {
    let button = document.createElement('button');
    button.textContent = index;
    button.dataset.key = index - 1;
    button.addEventListener('mousedown', function() {
        playSound(button.dataset.key);
    });
    button.addEventListener('mouseup', function() {
        pauseSound(button.dataset.key);
    });
    document.getElementById('sound-box').appendChild(button);
}

function playSound(index) {
    audioElements[index].loop = true;
    audioElements[index].play();
}

function pauseSound(index) {
    audioElements[index].pause();
}

window.addEventListener('keydown', function(e) {
    if (keyCodes.includes(e.keyCode)) {
        playSound(keyCodes.indexOf(e.keyCode));
    }
});

window.addEventListener('keyup', function(e) {
    if (keyCodes.includes(e.keyCode)) {
        pauseSound(keyCodes.indexOf(e.keyCode));
    }
});



// Handle calibration
document.getElementById('calibrationButton').addEventListener('click', function() {
    // prompt user to press each key
    alert('After pressing OK \nPress each key in order, starting with 1 and ending with 0.\n Dont be slow!');
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
document.getElementById('master-volume').addEventListener('input', function(e) {
    for (let i = 0; i < audioElements.length; i++) {
        audioElements[i].volume = e.target.value;
    }
});


// this current code works fine but when an additional key to the one being pressed is pressed
// the first sound doesnt loop once finished
// can we make the code more robust so that it can handle multiple keys being pressed at once
// and also make it so that the sound loops when the key is pressed and stops when the key is released
// please suggest code changes