const cardContainer = document.querySelector(".card-container");
const dealerContainer = document.querySelector(".dealer-cards");

const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");

const chips = document.querySelectorAll(".chip");
const pileAmount = document.querySelector(".pile-amount span");
const gameContainer = document.querySelector(".game-container");

const loader = document.querySelector(".loader");
const loaderBg = document.querySelector(".loader-bg");

const navWallet = document.querySelector(".navbar-wallet");

const dealerScoreOP = document.querySelector(".dealer-score");
const playerScoreOP = document.querySelector(".player-score");

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modal-message");
const logoutButton = document.getElementById("logout-button");
const playAgainButton = document.getElementById("play-again-button");





let count = 6;
let deckID;
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let wallet = parseInt(localStorage.getItem("wallet"), 10);
let pileValue = 0; 

navWallet.textContent = `${wallet}`




const drawCardFromDeck = async (numCards, cardArray, container) => {
  const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${numCards}`);
  const result = await response.json();
  const cards = result.cards;
  cards.forEach((card) => {
    const cardImage = document.createElement("img");
    cardImage.src = card.image;
    cardImage.alt = card.code;
    container.appendChild(cardImage);
    cardArray.push(card);
    updateScore(card, cardArray);
  });
};

const calculateCardValue = (cardValue) => {
  if (cardValue === "ACE") {
    return 11;
  } else if (cardValue === "KING" || cardValue === "QUEEN" || cardValue === "JACK") {
    return 10;
  } else {
    return parseInt(cardValue, 10);
  }
};

const updateScore = (card, cardArray) => {
  const values = calculateCardValue(card.value);
  if (cardArray === playerCards) {

    if (card.value === "ACE") {

      const chosenValue = prompt("Choose the value for Ace: 1 or 11");
      playerScore += parseInt(chosenValue, 10);
    } else {
      playerScore += values;
    }
    playerScoreOP.innerHTML = `<h1>Player score: ${playerScore}</h1>`;

    console.log("Player Score:", playerScore);
  } else if (cardArray === dealerCards) {

    if (card.value === "ACE") {

      const chosenValue = dealerScore + values[1] <= 21 ? values[1] : values[0];
      dealerScore += chosenValue;
    } else {
      dealerScore += values;
    }
    dealerScoreOP.innerHTML = `<h1>Dealer score: ${dealerScore}</h1>`;
    console.log("Dealer Score:", dealerScore);
  }
  if (playerScore === 21) {
    passNewCard();
  } else if (playerScore > 21) {
    determineWinner();
  }
};


logoutButton.addEventListener("click", () => {
/* log ud logik clear local, og tilbage til login */
});

playAgainButton.addEventListener("click", () => {
  location.reload();
});

const openModal = (message) => {
  modalMessage.textContent = message;
  modal.style.display = "block";
};

const closeModal = () => {
  modal.style.display = "none";
};

const determineWinner = () => {
  let message = "";
  if (playerScore === 21) {
    if (dealerScore === 21) {
      message = "Push! It's a tie!";
      updateWallet(pileValue); 
    } else {
      message = "Blackjack! You win!";
      updateWallet(pileValue * 2.5); 
    }
  } else if (playerScore > 21) {
    if (dealerScore > 21) {
      message = "Push! It's a tie!";
      updateWallet(pileValue); 
    } else {
      message = "You bust! Dealer wins!";
    }
  } else if (playerScore === dealerScore) {
    message = "Push! It's a tie!";
    updateWallet(pileValue); 
  } else if (dealerScore > 21) {
    message = "Dealer busts! You win!";
    updateWallet(pileValue * 2); 
  } else if (playerScore > dealerScore) {
    message = "You win!";
    updateWallet(pileValue * 2);
  } else {
    message = "Dealer wins!";
  }
  console.log(message);
  openModal(message); 
};

const updateWallet = async (amount) => {
  const username = localStorage.getItem('username');
  const newWallet = wallet + amount;

  try {
    const response = await fetch(`/users/updateWallet/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newWallet }),
    });
    const data = await response.json();
    wallet = newWallet;
    localStorage.setItem('wallet', newWallet);
    navWallet.textContent = newWallet;
    closeModal();
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
};


chips.forEach((chip) => {
  const chipValue = parseInt(chip.dataset.value);
  chip.addEventListener("click", () => {
    if (wallet >= chipValue) {
      updateWallet(-chipValue);
      updatePileAmount(chipValue); 
      chip.classList.add("chip-animate"); 
      setTimeout(() => {
        chip.classList.remove("chip-animate"); 
      }, 500);
      
      console.log("Chip clicked:", chipValue);
    } else {
      alert("Insufficient funds in the wallet!");
    }
  });
});

callButton.addEventListener("click", callNewCard);
passButton.addEventListener("click", passNewCard);

function showLoader() {
  loader.classList.remove("fade-out");
  loader.style.display = "block";
}

function hideLoader() {
  loaderBg.classList.add("fade-out");
  loader.classList.add("fade-out");
  gameContainer.classList.add("fade-in");
  
  setTimeout(() => {
    loader.style.display = "none";
    loaderBg.style.display = "none"; 
  }, 500);
}

function initialDraw() {
  drawCardFromDeck(2, playerCards, cardContainer);
  drawCardFromDeck(1, dealerCards, dealerContainer);
}

async function startGame() {
  showLoader();
  try {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`);
    if (!response.ok) {
      throw new Error("Failed to fetch deck");
    }
    const result = await response.json();
    deckID = result.deck_id;
    count = 3;
    
    initialDraw();
  } catch (error) {
    console.log("Error:", error);
  } finally {
    setTimeout(() => {
      hideLoader();
    }, 3000);
  }
}

function callNewCard() {
  if (playerScore < 21) {
    drawCardFromDeck(1, playerCards, cardContainer);
  }
}

function passNewCard() {
  if (dealerScore < 17) {
    drawCardFromDeck(1, dealerCards, dealerContainer).then(() => {
      if (dealerScore < 17) {
        passNewCard();
      } else {
        determineWinner();
      }
    });
  } else {
    determineWinner();
  }
}

function updatePileAmount(amount) {
  pileValue += amount; 
  pileAmount.textContent = pileValue; 
}


startGame();
