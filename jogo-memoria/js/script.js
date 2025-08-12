let playerName = "";
let score = 0;
let firstCard, secondCard;
let lockBoard = false;
let matchesFound = 0;
let totalPairs = 0;
let gridSize = 4;
let images = [];

document.getElementById("startBtn").addEventListener("click", () => {
  playerName = document.getElementById("playerName").value.trim();
  if (playerName === "") {
    alert("Digite seu nome!");
    return;
  }
  document.getElementById("playerScreen").style.display = "none";
  document.getElementById("difficultyScreen").style.display = "block";
});

function setDifficulty(size) {
  gridSize = size;
  totalPairs = (size * size) / 2;
  document.getElementById("difficultyScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("welcome").innerText = `Boa sorte, ${playerName}!`;
  loadImages();
}

async function loadImages() {
  try {
    // Usando API Picsum para gerar imagens aleatórias
    let imgSet = new Set();
    while (imgSet.size < totalPairs) {
      imgSet.add(`https://picsum.photos/80?random=${Math.floor(Math.random() * 1000)}`);
    }
    images = [...imgSet, ...imgSet]; // duplica para criar pares
    shuffle(images);
    createBoard();
  } catch (error) {
    console.error("Erro ao carregar imagens:", error);
  }
}

function createBoard() {
  const board = document.getElementById("gameBoard");
  board.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  board.innerHTML = "";
  images.forEach((src) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = src;
    const img = document.createElement("img");
    img.src = src;
    card.appendChild(img);
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped")) return;

  this.classList.add("flipped");
  if (!firstCard) {
    firstCard = this;
    return;
  }
  secondCard = this;
  checkMatch();
}

function checkMatch() {
  lockBoard = true;
  if (firstCard.dataset.image === secondCard.dataset.image) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    score += 5;
    matchesFound++;
    resetFlip();
    if (matchesFound === totalPairs) {
      endGame();
    }
  } else {
    score -= 3;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetFlip();
    }, 1000);
  }
  document.getElementById("score").innerText = `Pontuação: ${score}`;
}

function resetFlip() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function endGame() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("victoryScreen").style.display = "block";
  document.getElementById("finalScore").innerText = `${playerName}, sua pontuação foi: ${score}`;

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.push({ name: playerName, score: score });
  highScores.sort((a, b) => b.score - a.score);
  highScores = highScores.slice(0, 5);
  localStorage.setItem("highScores", JSON.stringify(highScores));

  const scoreList = document.getElementById("scoreList");
  scoreList.innerHTML = "";
  highScores.forEach(s => {
    const li = document.createElement("li");
    li.innerText = `${s.name}: ${s.score} pontos`;
    scoreList.appendChild(li);
  });
}
