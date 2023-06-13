const cardContainer = document.querySelector(".card-container");
const dealerContainer = document.querySelector(".dealer-cards");
const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");
const chips = document.querySelectorAll(".chip");
const pileAmount = document.querySelector(".pile-amount span");
const loader = document.querySelector(".loader");

let count = 6;
let deckID;
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let wallet = parseInt(localStorage.getItem("wallet"), 10);
let pileValue = 0; // Initialize pileValue as 0

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
    // Check if the card is an Ace
    if (card.value === "ACE") {
      // Prompt the user to choose the value for Ace based on their preference
      const chosenValue = prompt("Choose the value for Ace: 1 or 11");
      playerScore += parseInt(chosenValue, 10);
    } else {
      playerScore += values;
    }
    console.log("Player Score:", playerScore);
  } else if (cardArray === dealerCards) {
    // Check if the card is an Ace
    if (card.value === "ACE") {
      // Choose the value of Ace based on the preference (closer to 21)
      const chosenValue = dealerScore + values[1] <= 21 ? values[1] : values[0];
      dealerScore += chosenValue;
    } else {
      dealerScore += values;
    }
    console.log("Dealer Score:", dealerScore);
  }
  if (playerScore === 21) {
    passNewCard();
  } else if (playerScore > 21) {
    determineWinner();
  }
};

const determineWinner = () => {
  let message = "";
  if (playerScore === 21) {
    if (dealerScore === 21) {
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
  } catch (error) {
    console.error('Error updating wallet:', error);
  }
};

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

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
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
    }, 2000);
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
  pileValue += amount; // Add the amount to the pile value
  pileAmount.textContent = pileValue; // Update the pile amount in the HTML
}

// Call the startGame function to initiate the game
startGame();
