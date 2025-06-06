// app.js

let backendUrl = '';

window.onload = function() {
    backendUrl = prompt("Please enter your backend URL (example: https://xxxx.ngrok-free.app)");
    if (!backendUrl) {
        alert('Backend URL is required to proceed.');
    }
};

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    alert(result.message || result.error || "Upload completed");
}

async function askQuestion() {
    const question = document.getElementById('questionInput').value;
    if (!question) {
        alert('Please type a question.');
        return;
    }

    const response = await fetch(`${backendUrl}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: question })
    });

    const result = await response.json();
    document.getElementById('answerBox').innerText = result.summary || "No answer generated.";
}
