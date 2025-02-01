// List of common English words to filter out
const commonWords = ["what", "is", "by", "the", "of", "to", "in", "and", "that", "it", "on", "for", "knew","know","known","define","tell","about","me","comet","comets"];

// Function to process the input
function processInput() {
    const inputElement = document.getElementById('user-input');
    const query = inputElement.value.trim().toLowerCase();  // Trim extra spaces
    let words = query.split(/\s+/).filter(word => !commonWords.includes(word));  // Split by one or more spaces

    let keyword = words.length > 0 ? words[0] : '';

    displayMessage(query, 'user');

    console.log('Keyword:', keyword); // Add this line to debug

    if (keyword) {
        loadData(keyword);
    } else {
        displayMessage('Please provide a more specific query.', 'bot');
    }

    inputElement.value = '';
    inputElement.focus();
}

// Function to load the data from the corresponding data file
function loadData(keyword) {
    let firstLetter = keyword.charAt(0).toLowerCase();
    let scriptTag = document.createElement('script');
    scriptTag.src = `data/${firstLetter}.js`;

    scriptTag.onload = () => {
        if (window.data && window.data[keyword]) {
            const moreInfoUrl = window.data[keyword].blog || `https://bhuvaneshm-dev.blogspot.com`;
            const searchOnWebUrl = window.data[keyword].url || `https://www.ecosia.org/search?q=${encodeURIComponent(keyword)}`;
            displayMessage(window.data[keyword].text, 'bot', [], window.data[keyword].imageUrl, moreInfoUrl, searchOnWebUrl);
        } else {
            const defaultText = `No information found for ${keyword}.`;
            const moreInfoUrl = `https://bhuvaneshm-dev.blogspot.com`;
            const searchOnWebUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(keyword)}`;
            displayMessage(defaultText, 'bot', [], null, moreInfoUrl, searchOnWebUrl);
        }
        document.head.removeChild(scriptTag);
    };

    scriptTag.onerror = () => {
        const errorText = `Failed to load data for ${keyword}.`;
        const moreInfoUrl = `https://bhuvaneshm-dev.blogspot.com`;
        const searchOnWebUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(keyword)}`;
        displayMessage(errorText, 'bot', [], null, moreInfoUrl, searchOnWebUrl);
        document.head.removeChild(scriptTag);
    };

    document.head.appendChild(scriptTag);
}

function displayMessage(text, sender, links = [], imageUrl = null, moreInfoUrl = null, searchOnWebUrl = null) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    chatOutput.appendChild(messageDiv);

    // Add the content text
    const messageText = document.createElement('span');
    messageText.textContent = '';
    messageDiv.appendChild(messageText);

    const words = text.split(' '); // Split the text into words
    let wordIndex = 0;

    // Function to type words one by one
    function typeWord() {
        if (wordIndex < words.length) {
            messageText.textContent += words[wordIndex] + ' '; // Add each word with a space after it
            wordIndex++;
            setTimeout(typeWord, 150); // Adjust the speed of typing here (150ms per word)
        } else {
            chatOutput.scrollTop = chatOutput.scrollHeight;

            // Add image if provided (below the text)
            if (imageUrl) {
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;
    imageElement.alt = 'Response Image';
    imageElement.style.height = "250px"; // Set height directly
    imageElement.style.width = "auto"; // Width adjusts automatically
    messageDiv.appendChild(document.createElement('br'));
    messageDiv.appendChild(imageElement);
}


            // Add "For More Info" link
            if (moreInfoUrl) {
                const moreInfoLink = document.createElement('a');
                moreInfoLink.href = moreInfoUrl;
                moreInfoLink.target = '_blank';
                moreInfoLink.textContent = 'For more info';
                messageDiv.appendChild(document.createElement('br'));
                messageDiv.appendChild(moreInfoLink);
            }

            // Add "Search on Web" link
            if (searchOnWebUrl) {
                const searchOnWebLink = document.createElement('a');
                searchOnWebLink.href = searchOnWebUrl;
                searchOnWebLink.target = '_blank';
                searchOnWebLink.textContent = 'Search on web';
                messageDiv.appendChild(document.createElement('br'));
                messageDiv.appendChild(searchOnWebLink);
            }
        }
    }

    typeWord();
}


// Function to display messages in the chat output
function displayMessage(text, sender, links = [], imageUrl = null, moreInfoUrl = null, searchOnWebUrl = null) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    chatOutput.appendChild(messageDiv);

    // Add the content text
    const messageText = document.createElement('span');
    messageText.textContent = '';
    messageDiv.appendChild(messageText);

    const words = text.split(' '); // Split the text into words
    let wordIndex = 0;

    // Function to type words one by one
    function typeWord() {
        if (wordIndex < words.length) {
            messageText.textContent += words[wordIndex] + ' '; // Add each word with a space after it
            wordIndex++;
            setTimeout(typeWord, 150); // Adjust the speed of typing here (150ms per word)
        } else {
            chatOutput.scrollTop = chatOutput.scrollHeight;

            // Add image if provided (below the text)
            if (imageUrl) {
                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                imageElement.alt = 'Response Image';
                imageElement.width = 250;
                imageElement.height = 250;
                messageDiv.appendChild(document.createElement('br'));
                messageDiv.appendChild(imageElement);
            }

            // Add "For More Info" link
            if (moreInfoUrl) {
                const moreInfoLink = document.createElement('a');
                moreInfoLink.href = moreInfoUrl;
                moreInfoLink.target = '_blank';
                moreInfoLink.textContent = 'For more info';
                messageDiv.appendChild(document.createElement('br'));
                messageDiv.appendChild(moreInfoLink);
            }

            // Add "Search on Web" link
            if (searchOnWebUrl) {
                const searchOnWebLink = document.createElement('a');
                searchOnWebLink.href = searchOnWebUrl;
                searchOnWebLink.target = '_blank';
                searchOnWebLink.textContent = 'Search on web';
                messageDiv.appendChild(document.createElement('br'));
                messageDiv.appendChild(searchOnWebLink);
            }
        }
    }

    typeWord();
}


function handleSend() {
    const input = userInput.value.trim();
    if (!input) return;

    // Add user message
    addMessage(input, 'user');

    // Check for a response from the bot
    const response = botResponses[input.toLowerCase()];
    if (response) {
        if (typeof response === "object" && response.text && response.url) {
            // Handle case where response is an object with a text and URL
            setTimeout(() => displayMessage(response.text, 'bot', [{ url: response.url }]), 500);
        } else if (Array.isArray(response)) {
            // Handle case where response is an array
            setTimeout(() => displayMessage(response[0].text, 'bot', response), 500);
        } else {
            // Handle case where the response is a simple string
            setTimeout(() => displayMessage(response, 'bot'), 500);
        }
    } else {
        setTimeout(() => displayMessage(botResponses["default"], 'bot'), 500);
    }

    userInput.value = '';
}


// Event listener for the Enter key in the input field
document.getElementById('user-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevents the default action of the Enter key
        processInput();
    }
});

// Event listener for the send button
document.getElementById('send-btn').addEventListener('click', processInput);

