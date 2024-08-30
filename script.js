let score = 0;
let tries = 3;
let lastTail = '';
let playerName = '';
let leaderboard = [];

function startGame() {
    playerName = prompt("Nhập tên của bạn để bắt đầu:");
    if (!playerName || playerName.trim() === '') {
        alert("Bạn cần nhập tên để chơi!");
        return;
    }
    document.getElementById('playerName').innerText = `Người chơi: ${playerName}`;
    resetGame();
}

async function getLinkedWord() {
    const word = document.getElementById('wordInput').value.trim().toLowerCase();
    const url = `https://apichatbot.sumiproject.io.vn/game/linkword?word=${word}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(data); // Kiểm tra dữ liệu trả về từ API

        const resultDiv = document.getElementById('result');

        if (data.data === false) {
            // Nếu API trả về false
            resultDiv.innerHTML = `<p>Từ không có nghĩa. Bạn hãy thử lại!</p>`;
        } else if (data.data) {
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
            // Xử lý lỗi hoặc kết quả không hợp lệ khác
            handleIncorrectInput(resultDiv);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').innerHTML = `<p>Lỗi kết nối</p>`;
    }
}

function handleIncorrectInput(resultDiv) {
    tries -= 1;
    
    if (tries === 0) {
        resultDiv.innerHTML = `<p>Game Over!</p><p>Bắt đầu lại ván chơi mới...</p>`;
        updateLeaderboard();
        displayLeaderboard();
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
    document.getElementById('tries').innerText = `Mạng: ${tries}`;
}

function giveUp() {
    document.getElementById('result').innerHTML = `<p>Đầu Hàng - Bạn Được: ${score} Điểm</p>`;
    updateLeaderboard();
    displayLeaderboard();
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

function updateLeaderboard() {
    leaderboard.push({ name: playerName, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    if (leaderboard.length > 5) {
        leaderboard = leaderboard.slice(0, 5); // Giữ top 5 người chơi có điểm cao nhất
    }
}

function displayLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = "<h2>Top 5 Người Chơi Cao Điểm Nhất</h2>";
    leaderboard.forEach((player, index) => {
        leaderboardDiv.innerHTML += `<p>Top ${index + 1}: ${player.name} - ${player.score} điểm</p>`;
    });
}
