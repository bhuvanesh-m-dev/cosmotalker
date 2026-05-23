// CosmoTalker Web Interface - Calls the API endpoint

const API_URL = 'https://bhuvanesh-m-dev.github.io/cosmotalker/api/get';

const questionInput = document.getElementById('questionInput');
const askBtn = document.getElementById('askBtn');
const answerSection = document.getElementById('answerSection');
const answerText = document.getElementById('answerText');
const loadingIndicator = document.getElementById('loadingIndicator');
const clearBtn = document.getElementById('clearBtn');
const shareBtn = document.getElementById('shareBtn');
const timestampSpan = document.getElementById('timestamp');
const execTimeSpan = document.getElementById('execTime');
const toast = document.getElementById('toast');

let currentQuestion = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
        questionInput.value = decodeURIComponent(q);
        askQuestion();
    }
    
    askBtn.addEventListener('click', askQuestion);
    clearBtn.addEventListener('click', clearAnswer);
    shareBtn.addEventListener('click', shareAnswer);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askQuestion();
    });
    
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const q = chip.getAttribute('data-q');
            questionInput.value = q;
            askQuestion();
        });
    });
});

async function askQuestion() {
    const question = questionInput.value.trim();
    if (!question) {
        showToast('Please enter a question!', 'warning');
        return;
    }
    
    currentQuestion = question;
    
    setLoading(true);
    answerSection.style.display = 'none';
    
    try {
        const response = await callAPI(question);
        
        if (response.success) {
            displayAnswer(response);
            showToast('Answer ready! ✨', 'success');
        } else {
            showError(response.error || 'Failed to get answer');
            showToast('Error getting answer', 'error');
        }
    } catch (error) {
        console.error(error);
        showError('Connection error. Please try again.');
        showToast('API connection failed', 'error');
    } finally {
        setLoading(false);
    }
}

async function callAPI(question) {
    const url = `${API_URL}?q=${encodeURIComponent(question)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayAnswer(result) {
    let formatted = formatText(result.result || result.answer || 'No answer received');
    answerText.innerHTML = formatted;
    
    const date = new Date(result.timestamp);
    timestampSpan.innerHTML = `📅 ${date.toLocaleString()}`;
    execTimeSpan.innerHTML = `⚡ ${result.execution_time}s`;
    
    answerSection.style.display = 'block';
    answerSection.scrollIntoView({ behavior: 'smooth' });
    
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(result.query)}`;
    window.history.pushState({}, '', newUrl);
}

function formatText(text) {
    if (!text) return '';
    
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/•/g, '<span style="color:#a78bfa;">•</span>');
    formatted = formatted.replace(/─{10,}/g, '<hr>');
    
    return formatted;
}

function showError(message) {
    answerText.innerHTML = `
        <div style="color: #f87171;">
            <strong>⚠️ Error:</strong><br>
            ${escapeHtml(message)}
            <br><br>
            💡 Try asking about:<br>
            • Specific planets (Earth, Mars, Jupiter)<br>
            • ISS location<br>
            • SpaceX<br>
            • Fun facts
        </div>
    `;
    answerSection.style.display = 'block';
}

function clearAnswer() {
    answerSection.style.display = 'none';
    answerText.innerHTML = '';
    questionInput.value = '';
    questionInput.focus();
    window.history.pushState({}, '', window.location.pathname);
    showToast('Cleared', 'info');
}

async function shareAnswer() {
    if (!currentQuestion) {
        showToast('Nothing to share', 'warning');
        return;
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(currentQuestion)}`;
    
    try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copied! Share with others 🚀', 'success');
    } catch {
        prompt('Copy this link:', shareUrl);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        askBtn.disabled = true;
        askBtn.querySelector('span').textContent = '⏳ Thinking...';
        loadingIndicator.style.display = 'block';
        answerText.style.display = 'none';
    } else {
        askBtn.disabled = false;
        askBtn.querySelector('span').textContent = '🚀 Ask CosmoTalker';
        loadingIndicator.style.display = 'none';
        answerText.style.display = 'block';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type) {
    toast.textContent = message;
    toast.classList.add('show');
    
    if (type === 'error') {
        toast.style.borderColor = '#ef4444';
    } else if (type === 'success') {
        toast.style.borderColor = '#10b981';
    } else {
        toast.style.borderColor = '#667eea';
    }
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}