document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const gameSection = document.getElementById('gameSection');
    const playerNameDisplay = document.getElementById('playerName');
    const scoreDisplay = document.getElementById('score');
    const triesDisplay = document.getElementById('tries');
    const wordInput = document.getElementById('wordInput');
    const answerButton = document.getElementById('answerButton');
    const giveUpButton = document.getElementById('giveUpButton');
    const resultDiv = document.getElementById('result');
    const leaderboardDiv = document.getElementById('leaderboard');

    let score = 0;
    let tries = 3;
    let lastTail = '';
    let playerName = '';
    let leaderboard = [];

    // Bắt đầu game
    startButton.addEventListener('click', () => {
        playerName = prompt("Nhập tên của bạn để bắt đầu:");
        if (!playerName || playerName.trim() === '') {
            alert("Bạn cần nhập tên để chơi!");
            return;
        }
        // Hiển thị tên người chơi
        playerNameDisplay.innerText = `Người chơi: ${playerName}`;

        // Ẩn nút "Bắt Đầu Game"
        startButton.classList.add('hidden');

        // Hiển thị phần trò chơi
        gameSection.classList.remove('hidden');

        // Reset game state
        resetGame();
    });

    // Xử lý logic trả lời
    answerButton.addEventListener('click', async () => {
        const word = wordInput.value.trim().toLowerCase();
        const url = `https://apichatbot.sumiproject.io.vn/game/linkword?word=${word}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.data === false) {
                resultDiv.innerHTML = `<p>Từ không có nghĩa. Bạn hãy thử lại!</p>`;
            } else if (data.data) {
                const text = data.data.text;
                const tail = data.data.tail.toLowerCase();

                if (lastTail === '' || word.startsWith(lastTail)) {
                    score += 10;
                    resultDiv.innerHTML = `<p>Su: <strong>${text}</strong></p>`;
                    lastTail = tail;
                    updateScore();
                } else {
                    handleIncorrectInput();
                }
            } else {
                handleIncorrectInput();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            resultDiv.innerHTML = `<p>Lỗi kết nối</p>`;
        }
    });

    // Xử lý logic đầu hàng
    giveUpButton.addEventListener('click', () => {
        resultDiv.innerHTML = `<p>Đầu Hàng - Bạn Được : ${score} Điểm</p>`;
        updateLeaderboard();
        resetGame();
    });

    // Hàm xử lý sai từ
    function handleIncorrectInput() {
        tries -= 1;
        triesDisplay.innerText = `Mạng: ${tries}`;

        if (tries === 0) {
            resultDiv.innerHTML = `<p>Game Over!</p><p>Bắt đầu lại ván chơi mới...</p>`;
            updateLeaderboard();
            resetGame();
        } else {
            resultDiv.innerHTML = `<p>Sai rồi! Cần bắt đầu bằng từ: <strong>${lastTail}</strong>. Bạn còn ${tries} lượt.</p>`;
        }
    }

    // Hàm cập nhật điểm số
    function updateScore() {
        scoreDisplay.innerText = `Điểm: ${score}`;
    }

    // Hàm cập nhật bảng xếp hạng
    function updateLeaderboard() {
        leaderboard.push({ name: playerName, score });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 5); // Lấy top 5

        leaderboardDiv.innerHTML = "<h3>Bảng Xếp Hạng</h3>";
        leaderboard.forEach((player, index) => {
            leaderboardDiv.innerHTML += `<p>Top ${index + 1}: ${player.name} - ${player.score} điểm</p>`;
        });
    }

    // Hàm reset game
    function resetGame() {
        score = 0;
        tries = 3;
        lastTail = '';
        wordInput.value = '';
        updateScore();
        triesDisplay.innerText = `Mạng: ${tries}`;
        resultDiv.innerHTML = '';
    }
});
