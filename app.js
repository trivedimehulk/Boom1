// app.js

let backendUrl = '';

function saveBackendUrl() {
    const input = document.getElementById('backendUrlInput').value.trim();
    if (input) {
        backendUrl = input;
    } else {
        alert('Please enter a valid URL.');
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        showLoading(true);
        const response = await fetch(`${backendUrl}/upload`, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            body: formData,
        });

        const result = await response.json();
        addMessage("📄 Document uploaded successfully.", false);
    } catch (error) {
        addMessage("❌ Upload failed: " + error, false);
    } finally {
        showLoading(false);
    }
}

async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const question = questionInput.value.trim();
    if (!question) {
        alert('Please type a question.');
        return;
    }

    try {
        showLoading(true);
        const response = await fetch(`${backendUrl}/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'omit',
            body: JSON.stringify({ question: question })
        });

        const result = await response.json();
        addMessage(result.summary || "No answer generated.", true);
    } catch (error) {
        addMessage("❌ Failed to get response: " + error, true);
    } finally {
        showLoading(false);
        questionInput.value = '';
    }
}

function addMessage(messageText, showHeart) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');

    const textP = document.createElement('p');
    textP.innerText = messageText;
    messageDiv.appendChild(textP);

    if (showHeart) {
        const heart = document.createElement('span');
        heart.innerHTML = '♥'; // Heart icon
        heart.classList.add('heart');
        heart.addEventListener('click', function () {
            heart.classList.toggle('liked');
        });
        messageDiv.appendChild(heart);
    }

    chatbox.appendChild(messageDiv);

    // Scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Press Enter to Ask
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        askQuestion();
    }
}
