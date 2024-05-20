// utilityFunctions.js

// Implement utility functions for game logic and rendering
function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

function copyRoomLink() {
    const link = window.location.href;
    navigator.clipboard.writeText(link).then(() => {
        alert('Room link copied to clipboard!');
    });
}
