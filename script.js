let score = 0;
let tries = 3;
let lastTail = '';

async function getLinkedWord() {
    const word = document.getElementById('wordInput').value.trim().toLowerCase();  // Chuyển thành chữ thường để so sánh dễ dàng hơn
    const url = `https://apichatbot.sumiproject.io.vn/game/linkword?word=${word}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const resultDiv = document.getElementById('result');

        if (data.data) {
            const text = data.data.text;
            const head = data.data.head.toLowerCase();
            const tail = data.data.tail.toLowerCase();

            if (lastTail === '' || word.startsWith(lastTail)) {
                // Đầu vào đúng
                score += 10;
                resultDiv.innerHTML = `<p>Bot: <strong>${text}</strong></p>`;
                lastTail = tail;
                updateScore();
            } else {
                handleIncorrectInput(resultDiv);
            }
        } else {
            // Xử lý khi API trả về false
            handleIncorrectInput(resultDiv);
        }

        if (tries === 0) {
            resultDiv.innerHTML += `<p>Thua Cuộc - Bạn Đã Dùng Hết 3 Lượt Thử Lại!</p>`;
            resetGame();
        }

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        document.getElementById('result').innerHTML = `<p>Lỗi</p>`;
    }
}

function handleIncorrectInput(resultDiv) {
    tries -= 1;
    resultDiv.innerHTML = `<p>Sai rồi! Từ phải bắt đầu bằng: <strong>${lastTail}</strong>. Bạn còn ${tries} lượt thử lại.</p>`;
    updateTries();

    if (tries === 0) {
        resultDiv.innerHTML += `<p>Game Over!</p>`;
        resetGame();
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Điểm: ${score}`;
}

function updateTries() {
    document.getElementById('tries').innerText = `Chuỗi Thắng: ${tries}`;
}

function giveUp() {
    document.getElementById('result').innerHTML = `<p>Đầu Hàng - Bạn Được: ${score} Điểm</p>`;
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
