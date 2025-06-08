let backendUrl = '';

// Load from localStorage if exists
window.onload = function () {
    const savedUrl = localStorage.getItem('backendUrl');
    if (savedUrl) {
        backendUrl = savedUrl;
        console.log('✅ Loaded backend URL:', backendUrl);
    } else {
        console.log('❌ No backend URL set yet.');
    }
    loadSampleSuggestions();
};

function openSettings() {
    document.getElementById('settingsOverlay').style.display = 'flex';
}

function saveBackendUrl() {
    const input = document.getElementById('backendUrlInput').value.trim();
    if (input) {
        backendUrl = input;
        localStorage.setItem('backendUrl', backendUrl);
        document.getElementById('settingsOverlay').style.display = 'none';
        //alert('✅ Backend URL saved!');
    } else {
        alert('Please enter a valid URL.');
    }
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function getUserDetails() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };
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
    formData.append('userDetails', JSON.stringify(getUserDetails()));

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
        addMessage("📄 Document uploaded successfully.", true);
    } catch (error) {
        addMessage("❌ Upload failed: " + error, true);
    } finally {
        showLoading(false);
    }
}

async function askQuestion(customQuestion = null) {
    const questionInput = document.getElementById('questionInput');
    const question = customQuestion || questionInput.value.trim();
    if (!question) {
        alert('Please type a question.');
        return;
    }

    // Show user message first
    addMessage(question, false);

    const payload = {
        question: question,
        userDetails: getUserDetails()
    };

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
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        addMessage(result.summary || "No answer generated.", true);
    } catch (error) {
        addMessage("❌ Failed to get response: " + error.message, true);
    } finally {
        showLoading(false);
        questionInput.value = '';
    }
}

function addMessage(messageText, isBot) {
    const chatbox = document.getElementById('chatbox');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', isBot ? 'bot' : 'user');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('chat-icon');
    iconSpan.innerHTML = isBot ? '🤖' : '👤';

    const textP = document.createElement('p');
    textP.innerText = messageText;

    messageDiv.appendChild(iconSpan);
    messageDiv.appendChild(textP);

    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        askQuestion();
    }
}

function loadSampleSuggestions() {
    const suggestions = [
        "What services does WelbeHealth offer?",
        "Tell me about the PACE program.",
        "Where are WelbeHealth locations?"
    ];
    const chatbox = document.getElementById('chatbox');
    suggestions.forEach(suggestion => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('chat-message', 'suggestion');
        msgDiv.innerText = suggestion;
        msgDiv.onclick = () => askQuestion(suggestion);
        chatbox.appendChild(msgDiv);
    });
}
