// Get the popup and close button elements
const popup = document.getElementById('more-popup');
const moreBtn = document.getElementById('more-btn');
const closeBtn = document.getElementById('close-btn');

// Show the popup when 'More' button is clicked
moreBtn.onclick = function() {
    popup.style.display = 'block';
}

// Hide the popup when the close button is clicked
closeBtn.onclick = function() {
    popup.style.display = 'none';
}

// Close the popup if clicked outside of the popup content
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
}

