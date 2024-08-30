let score = 0;
let tries = 3;
let lastTail = '';

async function getLinkedWord() {
    const word = document.getElementById('wordInput').value.trim();
    const url = `https://apichatbot.sumiproject.io.vn/game/linkword?word=${word}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        const resultDiv = document.getElementById('result');

        if (data.data) {
            const head = data.data.head;
            const tail = data.data.tail;

            if (lastTail === '' || word.startsWith(lastTail)) {
                // Correct input
                score += 10;
                resultDiv.innerHTML = `<p>Correct! Next word should start with: <strong>${tail}</strong></p>`;
                lastTail = tail;
                updateScore();
            } else {
                handleIncorrectInput(resultDiv);
            }

        } else {
            // Incorrect word chain (API returned false)
            handleIncorrectInput(resultDiv);
        }

        if (tries === 0) {
            resultDiv.innerHTML += `<p>Game Over! You lost all your tries.</p>`;
            resetGame();
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').innerHTML = `<p>Error fetching data. Please try again later.</p>`;
    }
}

function handleIncorrectInput(resultDiv) {
    tries -= 1;
    resultDiv.innerHTML = `<p>Incorrect! The word should start with: <strong>${lastTail}</strong>. You have ${tries} tries left.</p>`;
    updateTries();

    if (tries === 0) {
        resultDiv.innerHTML += `<p>Game Over! You lost all your tries.</p>`;
        resetGame();
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Score: ${score}`;
}

function updateTries() {
    document.getElementById('tries').innerText = `Tries left: ${tries}`;
}

function giveUp() {
    document.getElementById('result').innerHTML = `<p>You gave up! Final score: ${score}</p>`;
    resetGame();
}

function resetGame() {
    score = 0;
    tries = 3;
    lastTail = '';
    updateScore();
    updateTries();
    document.getElementById('wordInput').value = '';
}
