// app.js

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file first.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://ac74-34-16-166-115.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    alert(result);
}

async function askQuestion() {
    const question = document.getElementById('questionInput').value;
    if (!question) {
        alert('Please type a question.');
        return;
    }

    const formData = new FormData();
    formData.append('query', question);

    const response = await fetch('https://ac74-34-16-166-115.ngrok-free.app/query', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    document.getElementById('answerBox').innerText = result.answer;
}
