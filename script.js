const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing every day helps you build speed and improve your overall accuracy.",
    "Consistent practice strengthens muscle memory, allowing your fingers to find the keys without conscious effort.",
    "As you continue advancing through new challenges, your typing speed increases while your mistakes gradually decrease with proper focus.",
    "Mastering advanced typing skills requires patience, dedication, and discipline, but the ability to type quickly and accurately opens doors to improved productivity and countless opportunities."
];

let currentLevel = 0;
let currentText = texts[currentLevel];
let startTime, timer;
let isStarted = false;
let correctChars = 0;
let totalChars = 0;
let inputIndex = 0;
let spans = [];
let finished = false;

const textDisplay = document.getElementById('text-display');
const messageDiv = document.getElementById('message');
const levelSpan = document.getElementById('level');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const timeSpan = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

function initializeText() {
    textDisplay.innerHTML = '';
    spans = [];
    for (let ch of currentText) {
        const span = document.createElement('span');
        span.textContent = ch;
        span.className = 'remaining';
        textDisplay.appendChild(span);
        spans.push(span);
    }
}

function updateDisplay(key) {
    if (finished) return;
    if (inputIndex < spans.length) {
        const span = spans[inputIndex];

        if (key === currentText[inputIndex]) {
            span.className = 'correct';
            correctChars++;
        } else {
            span.className = 'incorrect';
        }

        totalChars++;
        inputIndex++;
        updateStats();

        if (inputIndex === currentText.length) {
            clearInterval(timer);
            finished = true;

            const wrong = totalChars - correctChars;

            if (wrong === 0) {
                messageDiv.textContent = 'Perfect! Advancing...';
                setTimeout(nextLevel, 1500);
            } else {
                messageDiv.textContent = `${wrong} wrong characters. Try again!`;
            }
        }
    }
}

function handleBackspace() {
    if (finished || inputIndex === 0) return;

    inputIndex--;
    const span = spans[inputIndex];
    if (span.className === 'correct') correctChars--;
    totalChars--;

    span.className = 'remaining';
    updateStats();
}

function updateStats() {
    if (!isStarted) return;

    const timeElapsed = (Date.now() - startTime) / 1000;
    const wordsTyped = totalChars / 5;
    const wpm = Math.round((wordsTyped / timeElapsed) * 60) || 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    wpmSpan.textContent = wpm;
    accuracySpan.textContent = accuracy + '%';
    timeSpan.textContent = Math.round(timeElapsed) + 's';
}

function startTest() {
    if (finished) resetTest();
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timer = setInterval(updateStats, 1000);
    }
}

function resetTest() {
    clearInterval(timer);
    isStarted = false;
    inputIndex = 0;
    correctChars = 0;
    totalChars = 0;
    finished = false;

    initializeText();

    messageDiv.textContent = '';
    wpmSpan.textContent = '0';
    accuracySpan.textContent = '100%';
    timeSpan.textContent = '0s';
}

function nextLevel() {
    currentLevel++;
    if (currentLevel < texts.length) {
        currentText = texts[currentLevel];
        levelSpan.textContent = currentLevel + 1;
        resetTest();
    } else {
        messageDiv.textContent = 'Congratulations! You completed all levels!';
        setTimeout(() => {
            currentLevel = 0;
            currentText = texts[0];
            levelSpan.textContent = '1';
            resetTest();
        }, 3000);
    }
}

document.addEventListener('keydown', e => {
    if (!isStarted) startTest();

    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        updateDisplay(e.key);
    } else if (e.key === 'Backspace') {
        handleBackspace();
    }
});

startBtn?.addEventListener('click', startTest);
resetBtn?.addEventListener('click', resetTest);

initializeText();
