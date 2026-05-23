// Space Q&A System using CosmoTalker
// Stateless - every request is independent

let pyodide = null;
let isInitialized = false;
let initPromise = null;

// Initialize Pyodide with CosmoTalker
async function initCosmoTalker() {
    if (isInitialized && pyodide) return pyodide;
    if (initPromise) return initPromise;
    
    initPromise = (async () => {
        const statusDiv = document.getElementById('answerText');
        if (statusDiv && !window.location.pathname.includes('answer.html')) {
            statusDiv.innerHTML = '<div class="loading-spinner"></div><div>🌌 Loading CosmoTalker engine...</div>';
        }
        
        // Load Pyodide
        pyodide = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/",
            stdout: (text) => console.log("[Python]", text),
            stderr: (text) => console.error("[Python Error]", text)
        });
        
        // Setup Python environment
        pyodide.runPython(`
import sys
import io

# Capture output
class OutputCapture:
    def __init__(self):
        self.buffer = io.StringIO()
    
    def write(self, text):
        self.buffer.write(text)
        sys.__stdout__.write(text)
    
    def get_output(self):
        return self.buffer.getvalue()
    
    def clear(self):
        self.buffer = io.StringIO()

_capture = OutputCapture()
sys.stdout = _capture
sys.stderr = _capture

def get_captured():
    return _capture.get_output()

def clear_capture():
    _capture.clear()
        `);
        
        // Install CosmoTalker
        await pyodide.loadPackage("micropip");
        const micropip = pyodide.pyimport("micropip");
        
        await micropip.install(["cosmodb", "cosmotalker==2.62", "requests", "pytz"]);
        
        // Mock tkinter and setup CosmoTalker
        pyodide.runPython(`
import sys
import types

# Mock tkinter for browser
sys.modules['tkinter'] = types.ModuleType('tkinter')
sys.modules['tkinter.messagebox'] = types.ModuleType('tkinter.messagebox')
sys.modules['tkinter.ttk'] = types.ModuleType('tkinter.ttk')
sys.modules['customtkinter'] = types.ModuleType('customtkinter')

import cosmotalker as ct

# Disable image functions (not supported in browser)
class DummyImg:
    def __call__(self, *args, **kwargs):
        return "⚠️ Image preview not available in web version"

ct.img = DummyImg()

print("✅ CosmoTalker ready!")
        `);
        
        isInitialized = true;
        return pyodide;
    })();
    
    return initPromise;
}

// Process a question using CosmoTalker
async function askCosmoTalker(question) {
    const startTime = performance.now();
    
    try {
        await initCosmoTalker();
        
        // Clear previous output
        pyodide.runPython(`clear_capture()`);
        
        // Convert question to appropriate CosmoTalker function
        const pythonCode = generateQueryCode(question);
        
        // Execute the query
        await pyodide.runPythonAsync(pythonCode);
        
        // Get captured output
        let answer = pyodide.runPython(`get_captured()`);
        
        // Clean up the answer
        answer = answer.replace(/✅ CosmoTalker ready!\n/g, '');
        answer = answer.trim();
        
        const executionTime = ((performance.now() - startTime) / 1000).toFixed(2);
        
        if (!answer || answer.length < 5) {
            answer = `I couldn't find specific information about "${question}". Try asking about planets, stars, galaxies, or space facts!`;
        }
        
        return {
            success: true,
            answer: answer,
            question: question,
            executionTime: executionTime,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            answer: `❌ Error: ${error.message}. Please try a different question.`,
            question: question,
            executionTime: ((performance.now() - startTime) / 1000).toFixed(2),
            timestamp: new Date().toISOString()
        };
    }
}

// Generate Python code based on question type
function generateQueryCode(question) {
    const q = question.toLowerCase().trim();
    
    // Planet queries
    const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    for (let planet of planets) {
        if (q.includes(planet)) {
            return `
import cosmotalker as ct
try:
    result = ct.planet_info('${planet}')
    print(result)
except Exception as e:
    print(f"Could not fetch ${planet} data: {e}")
    print("\\n🌍 Quick Facts:")
    print(f"  • ${planet.charAt(0).toUpperCase() + planet.slice(1)} is a planet in our solar system")
    if '${planet}' == 'earth':
        print("  • Earth is the third planet from the Sun")
        print("  • Earth is the only known planet with life")
    elif '${planet}' == 'mars':
        print("  • Mars is called the Red Planet")
        print("  • Mars has the tallest volcano in the solar system")
    elif '${planet}' == 'jupiter':
        print("  • Jupiter is the largest planet")
        print("  • Jupiter has 79 known moons")
`;
        }
    }
    
    // Specific queries
    if (q.includes('iss') || q.includes('space station')) {
        return `
import cosmotalker as ct
try:
    result = ct.celestrak('iss')
    print("🛰️ International Space Station (ISS)")
    print("─" * 40)
    print(result)
except:
    print("🛰️ International Space Station (ISS)")
    print("─" * 40)
    print("The ISS orbits Earth at ~400km altitude")
    print("It travels at 28,000 km/h")
    print("Completes an orbit every 90 minutes")
    print("Visible from Earth as a bright moving dot")`;
    }
    
    if (q.includes('apod') || q.includes('picture of the day')) {
        return `
import cosmotalker as ct
try:
    result = ct.apod()
    print("📸 Astronomy Picture of the Day")
    print("─" * 40)
    print(result)
except:
    print("📸 NASA's Astronomy Picture of the Day")
    print("─" * 40)
    print("Visit APOD for daily space images")
    print("Each day features a different space photo")`;
    }
    
    if (q.includes('spacex') || q.includes('falcon') || q.includes('rocket')) {
        return `
import cosmotalker as ct
try:
    result = ct.spacex()
    print("🚀 SpaceX Information")
    print("─" * 40)
    print(result)
except:
    print("🚀 SpaceX")
    print("─" * 40)
    print("SpaceX launches rockets including Falcon 9 and Starship")
    print("First private company to send astronauts to ISS")
    print("Developing Starship for Mars missions")`;
    }
    
    if (q.includes('fun fact') || q.includes('random fact') || q.includes('interesting fact')) {
        return `
import cosmotalker as ct
try:
    result = ct.get_fun_fact()
    print("✨ Fun Space Fact")
    print("─" * 40)
    print(result)
except:
    print("✨ Fun Space Fact")
    print("─" * 40)
    print("Did you know? A day on Venus is longer than its year!");
    print("Venus takes 243 Earth days to rotate but only 225 days to orbit the Sun")`;
    }
    
    if (q.includes('search') || q.includes('find')) {
        // Extract search term
        let searchTerm = q.replace('search', '').replace('find', '').replace('about', '').trim();
        if (!searchTerm) searchTerm = q;
        return `
import cosmotalker as ct
try:
    result = ct.search('${searchTerm}')
    print("🔍 Search Results for: ${searchTerm}")
    print("─" * 40)
    print(result)
except:
    print("🔍 Searching space database...")
    print(f"Looking for information about: ${searchTerm}")
    print("Try asking about specific planets, stars, or missions!")`;
    }
    
    if (q.includes('star') || q.includes('galaxy') || q.includes('constellation')) {
        return `
import cosmotalker as ct
try:
    result = ct.star_info('${q}')
    print("⭐ Star Information")
    print("─" * 40)
    print(result)
except:
    print("⭐ Stars and Galaxies")
    print("─" * 40)
    print("Our galaxy, the Milky Way, contains 100-400 billion stars")
    print("The nearest star system is Alpha Centauri (4.37 light years away)")
    print("Stars are born in nebulae and die as white dwarfs, neutron stars, or black holes")`;
    }
    
    // Default query - use planet_info with error handling
    return `
import cosmotalker as ct
try:
    # Try to get planet info (works for planet names)
    result = ct.planet_info('${q.split(' ')[0]}')
    print(result)
except:
    # Try general search
    try:
        result = ct.search('${q}')
        if result and len(result) > 10:
            print(result)
        else:
            print("🌌 Space Information")
            print("─" * 40)
            print(f"Question: ${q}")
            print("\\n💡 Try these specific queries:")
            print("  • Planet names (Earth, Mars, Jupiter)")
            print("  • 'iss location' for space station")
            print("  • 'fun fact' for amazing space facts")
            print("  • 'apod' for astronomy picture")
            print("  • 'spacex' for rocket info")
    except:
        print("🌌 Space Query")
        print("─" * 40)
        print(f"Question: ${q}")
        print("\\nCosmoTalker can answer about:")
        print("  • Planets in our solar system")
        print("  • International Space Station")
        print("  • SpaceX missions")
        print("  • Astronomy facts")
        print("  • Space search")`;
}

// Display answer in UI
function displayAnswer(result) {
    const answerContainer = document.getElementById('answerContainer');
    const answerText = document.getElementById('answerText');
    
    if (!answerContainer) {
        // We're on answer.html page
        const wrapper = document.getElementById('answerWrapper');
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="answer-wrapper">
                    <div class="question-badge">
                        <span>📋 Question:</span>
                        <strong>${escapeHtml(result.question)}</strong>
                    </div>
                    <div class="answer-box ${!result.success ? 'error' : ''}">
                        ${result.success ? formatAnswer(result.answer) : `<div class="error">${escapeHtml(result.answer)}</div>`}
                    </div>
                    <div class="meta">
                        <span>⏱️ ${result.executionTime}s</span>
                        <span>🌌 Powered by CosmoTalker</span>
                        <span>📅 ${new Date(result.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    // On main page
    if (result.success) {
        answerText.innerHTML = formatAnswer(result.answer);
    } else {
        answerText.innerHTML = `<div class="error-message">${escapeHtml(result.answer)}</div>`;
    }
    
    answerContainer.style.display = 'block';
    document.getElementById('answerContainer').scrollIntoView({ behavior: 'smooth' });
    
    // Update URL without reloading (for sharing)
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(result.question)}`;
    window.history.pushState({ question: result.question }, '', newUrl);
}

// Format answer with nice styling
function formatAnswer(answer) {
    // Convert markdown-like formatting
    let formatted = escapeHtml(answer);
    
    // Format lists
    formatted = formatted.replace(/•/g, '<span class="bullet">•</span>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Format headers
    formatted = formatted.replace(/([A-Z][A-Za-z\s]+:)/g, '<strong>$1</strong>');
    
    // Format separators
    formatted = formatted.replace(/─{10,}/g, '<hr class="answer-hr">');
    
    return formatted;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Main ask function
async function askQuestion() {
    const input = document.getElementById('questionInput');
    const question = input.value.trim();
    const askBtn = document.getElementById('askBtn');
    
    if (!question) {
        showFeedback('Please enter a question!', 'error');
        return;
    }
    
    // Show loading
    askBtn.disabled = true;
    askBtn.innerHTML = '<span>⏳ Consulting CosmoTalker...</span>';
    
    const answerContainer = document.getElementById('answerContainer');
    if (answerContainer) {
        answerContainer.style.display = 'block';
        document.getElementById('answerText').innerHTML = '<div class="loading-spinner"></div><div>🤔 Thinking about your question...</div>';
    }
    
    try {
        const result = await askCosmoTalker(question);
        displayAnswer(result);
        showFeedback('✨ Answer ready!', 'success');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('answerText').innerHTML = `<div class="error-message">❌ Sorry, something went wrong. Please try again.</div>`;
        showFeedback('Error getting answer', 'error');
    } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = '<span>🚀 Ask CosmoTalker</span>';
    }
}

// Share current answer
function shareAnswer() {
    const question = document.getElementById('questionInput')?.value || window.currentQuestion;
    if (!question) return;
    
    const shareUrl = `${window.location.origin}${window.location.pathname.replace('index.html', '')}answer.html?q=${encodeURIComponent(question)}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        const feedback = document.getElementById('shareFeedback');
        if (feedback) {
            feedback.textContent = '✅ Link copied!';
            setTimeout(() => feedback.textContent = '', 2000);
        }
    }).catch(() => {
        prompt('Copy this link to share:', shareUrl);
    });
}

// Helper functions
function setQuestion(text) {
    document.getElementById('questionInput').value = text;
    askQuestion();
}

function clearAnswer() {
    const container = document.getElementById('answerContainer');
    if (container) container.style.display = 'none';
    document.getElementById('questionInput').value = '';
}

function showFeedback(message, type) {
    const feedback = document.getElementById('shareFeedback');
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `share-feedback ${type}`;
        setTimeout(() => feedback.textContent = '', 3000);
    }
}

function handleEnter(event) {
    if (event.key === 'Enter') {
        askQuestion();
    }
}

// Check URL for direct question
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const question = urlParams.get('q');
    
    if (question && document.getElementById('questionInput')) {
        document.getElementById('questionInput').value = question;
        await askQuestion();
    } else if (question && window.location.pathname.includes('answer.html')) {
        window.currentQuestion = question;
        const result = await askCosmoTalker(question);
        displayAnswer(result);
    }
});