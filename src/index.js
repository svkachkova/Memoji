const EMOJI = "🐹🐼🐨🐷🐸🐙"; // firefox
const E = [
  "🐹",
  "🐼",
  "🐨",
  "🐷",
  "🐸",
  "🐙",
  "🐹",
  "🐼",
  "🐨",
  "🐷",
  "🐸",
  "🐙"
]; //chrome

const cardsWrapper = document.querySelector(".cards-wrapper");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = document.querySelector(".modal");
const button = document.querySelector(".button");

let openedCards = [];
let matchedCards = [];
let emojis = [];

let isFirstClick = true;
let isGameOver = false;

// -------------start---------------
function startGame() {
  emojis = [...EMOJI, ...EMOJI];

  shuffle(emojis);
  innerCards();

  startTimer();

  isGameOver = false;
  matchedCards = [];
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function innerCards() {
  const cards = cardsWrapper.querySelectorAll(".front-face");
  cards.forEach(item => (item.innerHTML = emojis.shift()));
}

// -------------flip---------------
function openCard(card) {
  if (openedCards.length == 2) {
    openedCards.forEach(item => flipOffCard(item));
    removeUnmatched();
  }

  openedCards.push(card);
  flipCard(card);

  if (openedCards.length == 2) {
    isMatched(openedCards) ? matched() : unmatched();
  }
}

function flipCard(card) {
  card.back.classList.add("hidden", "flip");
  card.front.classList.remove("hidden");
  card.front.classList.add("flip");
}

function flipOffCard(card) {
  card.back.classList.remove("hidden", "flip");
  card.front.classList.remove("flip");
  card.front.classList.add("hidden");
}

// -------------match---------------
function match() {
  if (openedCards.length == 2) {
    isMatched(openedCards) ? matched() : unmatched();
  }
}

function isMatched(cards) {
  return cards[0]["front"].innerHTML == cards[1]["front"].innerHTML;
}

function matched() {
  openedCards.forEach(item => {
    item.front.classList.add("matched");
    matchedCards.push(item);
  });

  if (matchedCards.length == 12) {
    youWin();
  }

  openedCards = [];
}

function unmatched() {
  openedCards.forEach(item => {
    item.front.classList.add("unmatched");
  });
}

function removeMatced() {
  matchedCards.forEach(item => {
    item.front.classList.remove("matched");
  });
}

function removeUnmatched() {
  openedCards.forEach(item => {
    item.front.classList.remove("unmatched");
  });
  openedCards = [];
}

// -------------timer---------------
let interval, timeout;

function startTimer() {
  const timer = document.querySelector(".timer");
  let counter = 60;

  timer.innerHTML = "1:00";

  interval = setInterval(() => {
    counter -= 1;
    timer.innerHTML = counter > 9 ? `0:${counter}` : `0:0${counter}`;

    if (isGameOver) {
      clearInterval(interval);
      clearInterval(timeout);
    }
  }, 1000);

  timeout = setTimeout(() => {
    clearInterval(interval);
    timer.innerHTML = "0:00";
    youLose();
  }, 60000);
}

// -------------modal---------------
function playAgain() {
  const cards = cardsWrapper.querySelectorAll(".card");

  cards.forEach(item => {
    flipOffCard({
      back: item.querySelector(".back-face"),
      front: item.querySelector(".front-face")
    });
  });

  removeMatced();

  hideModal();
  startGame();
}

function showModal() {
  modalOverlay.style.display = "block";
  modal.appendChild(button);
}

function hideModal() {
  modalOverlay.style.display = "none";
}

function youWin() {
  isGameOver = true;
  modal.innerHTML = "Win";
  showModal();
}

function youLose() {
  isGameOver = true;
  modal.innerHTML = "Lose";
  showModal();
}

// -------------events---------------
cardsWrapper.addEventListener("click", e => {
  if (isFirstClick) {
    startGame();
    isFirstClick = false;
  }

  const target = e.target;
  if (!target.classList.contains("back-face")) return;

  const card = {
    back: target,
    front: target.parentNode.querySelector(".front-face")
  };

  openCard(card);
});

button.addEventListener("click", playAgain);
