const cardContainer = document.querySelector(".card-container");
const dealerContainer = document.querySelector(".dealer-cards");
const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");
const chips = document.querySelectorAll(".chip");
const pileAmount = document.querySelector(".pile-amount span");

let count = 6;
let deckID;
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let wallet = parseInt(localStorage.getItem("wallet"), 10);
let pileValue = 0; // Initialize pileValue as 0

fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`)
  .then((response) => response.json())
  .then((result) => {
    deckID = result.deck_id;
    count = 3;
    initialDraw();
  })
  .catch((error) => console.log("error", error));

function initialDraw() {
  drawCard(2, playerCards, cardContainer);
  drawCard(1, dealerCards, dealerContainer);
}

function drawCard(numCards, cardArray, container) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${numCards}`)
    .then((response) => response.json())
    .then((result) => {
      const cards = result.cards;
      for (let i = 0; i < numCards; i++) {
        const card = cards[i];
        const cardImage = document.createElement("img");
        cardImage.src = card.image;
        cardImage.alt = card.code;
        container.appendChild(cardImage);
        cardArray.push(card);
        updateScore(card, cardArray);
      }
    })
    .catch((error) => console.log("error", error));
}

function calculateCardValue(cardValue) {
  if (cardValue === "ACE") {
    return 11;
  } else if (cardValue === "KING" || cardValue === "QUEEN" || cardValue === "JACK") {
    return 10;
  } else {
    return parseInt(cardValue, 10);
  }
}

function updateScore(card, cardArray) {
  const value = calculateCardValue(card.value);
  if (cardArray === playerCards) {
    playerScore += value;
    if (playerScore > 21 && cardArray.some((card) => card.value === "ACE")) {
      playerScore -= 10;
    }
    console.log("Player Score:", playerScore);
  } else if (cardArray === dealerCards) {
    dealerScore += value;
    if (dealerScore > 21 && cardArray.some((card) => card.value === "ACE")) {
      dealerScore -= 10;
    }
    console.log("Dealer Score:", dealerScore);
  }
  if (playerScore === 21) {
    passNewCard();
  } else if (playerScore > 21) {
    determineWinner();
  }
}

function callNewCard() {
  if (playerScore < 21) {
    drawCard(1, playerCards, cardContainer);
  }
}

function passNewCard() {
  if (dealerScore < 17) {
    drawCard(1, dealerCards, dealerContainer);
  } else {
    determineWinner();
  }
}

function determineWinner() {
  let message = "";
  if (playerScore === 21 && playerCards.length === 2) {
    if (dealerScore === 21 && dealerCards.length === 2) {
      message = "Push! It's a tie!";
      updateWallet(pileValue); // Return the bet amount to the player
    } else {
      message = "Blackjack! You win!";
      updateWallet(pileValue * 2.5); // Player wins 2.5 times the bet
    }
  } else if (playerScore > 21) {
    if (dealerScore > 21) {
      message = "Push! It's a tie!";
      updateWallet(pileValue); // Return the bet amount to the player
    } else {
      message = "You bust! Dealer wins!";
    }
  } else if (playerScore === dealerScore) {
    message = "Push! It's a tie!";
    updateWallet(pileValue); // Return the bet amount to the player
  } else if (dealerScore > 21) {
    message = "Dealer busts! You win!";
    updateWallet(pileValue * 2); // Player wins the bet amount
  } else if (playerScore > dealerScore) {
    message = "You win!";
    updateWallet(pileValue * 2); // Player wins the bet amount
  } else {
    message = "Dealer wins!";
  }
  console.log(message);
}

function updateWallet(amount) {
  wallet += amount;
  localStorage.setItem("wallet", wallet);
  document.querySelector(".navbar-wallet").textContent = wallet;
}

// Event listeners for chip buttons
chips.forEach((chip) => {
  const chipValue = parseInt(chip.dataset.value);
  chip.addEventListener("click", () => {
    if (wallet >= chipValue) {
      updateWallet(-chipValue); // Subtract the chip value from the wallet
      updatePileAmount(chipValue); // Add the chip value to the pile amount
      // Perform additional actions as needed (e.g., add the chip to the bet)
      console.log("Chip clicked:", chipValue);
    } else {
      alert("Insufficient funds in the wallet!");
    }
  });
});

callButton.addEventListener("click", callNewCard);
passButton.addEventListener("click", passNewCard);

function updatePileAmount(amount) {
  pileValue += amount; // Add the amount to the pile value
  pileAmount.textContent = pileValue; // Update the pile amount in the HTML
}
