let score = 0;
let tries = 3;
let lastTail = '';

async function getLinkedWord() {
    const word = document.getElementById('wordInput').value.trim().toLowerCase();
    const url = `https://apichatbot.sumiproject.io.vn/game/linkword?word=${word}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // Kiểm tra dữ liệu trả về từ API

        const resultDiv = document.getElementById('result');

        if (data.data) {
            const text = data.data.text;
            const tail = data.data.tail.toLowerCase();

            if (lastTail === '' || word.startsWith(lastTail)) {
                // Nếu đúng từ nối
                score += 10;
                resultDiv.innerHTML = `<p>Bot: <strong>${text}</strong></p>`;
                lastTail = tail;
                updateScore();
            } else {
                // Nếu sai từ nối
                handleIncorrectInput(resultDiv);
            }
        } else {
            // API trả về dữ liệu không hợp lệ
            handleIncorrectInput(resultDiv);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').innerHTML = `<p>Lỗi</p>`;
    }
}

function handleIncorrectInput(resultDiv) {
    tries -= 1;
    
    if (tries === 0) {
        resultDiv.innerHTML = `<p>Game Over!</p><p>Bắt đầu lại ván chơi mới...</p>`;
        setTimeout(resetGame, 2000);  // Đợi 2 giây rồi khởi động lại game
    } else {
        resultDiv.innerHTML = `<p>Sai rồi! Từ phải bắt đầu bằng: <strong>${lastTail}</strong>. Bạn còn ${tries} lượt thử lại.</p>`;
    }
    
    updateTries();
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
    document.getElementById('result').innerHTML = '';  // Xóa kết quả để bắt đầu ván mới
}
