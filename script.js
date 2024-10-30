const words = ["javascript", "html", "css", "web", "hangman"];
let selectedWord;
let guessedLetters = [];
let wrongLetters = [];
let remainingGuesses = 6;

function updateWordDisplay() {
    const wordContainer = document.getElementById('wordContainer');
    wordContainer.innerHTML = selectedWord
        .split('')
        .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
        .join(' ');
}

function handleGuess() {
    const letterInput = document.getElementById('letterInput');
    const guessedLetter = letterInput.value.toLowerCase();
    
    if (!guessedLetter || guessedLetter.length !== 1 || !/^[a-zA-Z]+$/.test(guessedLetter)) {
        document.getElementById('message').textContent = "Por favor, ingresa una letra válida.";
        letterInput.value = '';
        return;
    }

    if (guessedLetters.includes(guessedLetter) || wrongLetters.includes(guessedLetter)) {
        document.getElementById('message').textContent = "Ya has intentado esa letra.";
        letterInput.value = '';
        return;
    }

    document.getElementById('message').textContent = '';

    if (selectedWord.includes(guessedLetter)) {
        guessedLetters.push(guessedLetter);
        checkWin();
    } else {
        wrongLetters.push(guessedLetter);
        remainingGuesses--;
        updateWrongLetters();
        checkLoss();
    }

    letterInput.value = '';
    updateWordDisplay();
}

function updateWrongLetters() {
    document.getElementById('wrongLetters').textContent = `Letras incorrectas: ${wrongLetters.join(', ')}`;
    document.getElementById('remainingGuesses').textContent = `Intentos restantes: ${remainingGuesses}`;
}

function checkWin() {
    const wordDisplay = document.getElementById('wordContainer').textContent.replace(/\s/g, '');
    if (wordDisplay === selectedWord) {
        document.getElementById('message').textContent = "¡Felicidades, ganaste!";
        document.getElementById('guessBtn').disabled = true;
        addToHistory(true);
        saveHistory();
    }
}

function checkLoss() {
    if (remainingGuesses <= 0) {
        document.getElementById('message').textContent = `Perdiste. La palabra era: ${selectedWord}`;
        document.getElementById('guessBtn').disabled = true;
        addToHistory(false);
        saveHistory();
    }
}

function addToHistory(won) {
    const now = new Date();
    const dateString = now.toLocaleString();
    const historyItem = {
        word: selectedWord,
        result: won ? 'Ganó' : 'Perdió',
        date: dateString
    };
    const history = getHistory();
    history.push(historyItem);
    localStorage.setItem('hangmanHistory', JSON.stringify(history));
}

function saveHistory() {
    const history = getHistory();
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.forEach(item => {
        const historyEntry = document.createElement('li');
        historyEntry.textContent = `Palabra: ${item.word}, Resultado: ${item.result}, Fecha y Hora: ${item.date}`;
        historyList.appendChild(historyEntry);
    });
}

function getHistory() {
    const history = localStorage.getItem('hangmanHistory');
    return history ? JSON.parse(history) : [];
}

function initGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongLetters = [];
    remainingGuesses = 6;
    updateWordDisplay();
    saveHistory();
    document.getElementById('guessBtn').addEventListener('click', handleGuess);
    loadHistory();
}

function loadHistory() {
    const history = getHistory();
    const historyList = document.getElementById('historyList');
    history.forEach(item => {
        const historyEntry = document.createElement('li');
        historyEntry.textContent = `Palabra: ${item.word}, Resultado: ${item.result}, Fecha y Hora: ${item.date}`;
        historyList.appendChild(historyEntry);
    });
}

window.onload = initGame;
