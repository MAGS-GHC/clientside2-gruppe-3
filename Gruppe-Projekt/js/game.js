const cardContainer = document.querySelector(".card-container");
const dealerContainer = document.querySelector(".dealer-cards");
const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");

let count = 6;
let deckID;
let score = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];

fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`)
  .then((response) => response.json())
  .then((result) => {
    deckID = result.deck_id;
    count = 3;
    initialDraw();
  })
  .catch((error) => console.log("error", error));

function initialDraw() {
  drawCard(2, playerCards, cardContainer, score);
  drawCard(1, dealerCards, dealerContainer, dealerScore);
}

function drawCard(numOfCards, cardArray, container, currentScore) {
  fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${numOfCards}`)
    .then((response) => response.json())
    .then((result) => {
      for (let i = 0; i < result.cards.length; i++) {
        const card = result.cards[i];
        container.innerHTML += `
          <div class="cardWrapping">
            <img src="${card.image}" alt="" class="card_image">
          </div>`;
        cardArray.push(card);
        currentScore += calculateCardScore(card.value);
      }
      console.log(container === dealerContainer ? "Dealer Score:" : "Player Score:", currentScore);

      // Check for winning condition
      if (currentScore === 21) {
        if (container === cardContainer) {
          alert("Player wins!");
        } else if (container === dealerContainer) {
          alert("Dealer wins!");
        }
      } else if (currentScore > 21) {
        if (container === cardContainer) {
          alert("Player busts! Dealer wins!");
        } else if (container === dealerContainer) {
          alert("Dealer busts! Player wins!");
        }
      }

      return currentScore; // Return the updated score
    })
    .then((updatedScore) => {
      if (container === cardContainer) {
        score = updatedScore; // Update the player's score
      } else if (container === dealerContainer) {
        dealerScore = updatedScore; // Update the dealer's score
      }
    })
    .catch((error) => console.log("error", error));
}

function calculateCardScore(value) {
  if (value === "JACK" || value === "QUEEN" || value === "KING") {
    return 10;
  } else if (value === "ACE") {
    return 1;
  } else {
    return parseInt(value);
  }
}

function callNewCard() {
  if (score < 21) {
    drawCard(1, playerCards, cardContainer, score);
  }
}

function passNewCard() {
  if (dealerScore < 17 && score <= 21) {
    setTimeout(() => {
      drawCard(1, dealerCards, dealerContainer, dealerScore);
      passNewCard();
    }, 1000); // Delay between drawing cards
  } else {
    determineWinner();
  }
}

function determineWinner() {
  if (score === dealerScore) {
    alert("It's a tie!");
  } else if (score === 21 || (score < 21 && dealerScore > 21)) {
    alert("Player wins!");
  } else if (dealerScore === 21 || (dealerScore < 21 && score > 21)) {
    alert("Dealer wins!");
  } else if (score > 21 && dealerScore > 21) {
    alert("Both player and dealer bust. It's a tie!");
  } else {
    if (score > dealerScore) {
      alert("Player wins!");
    } else {
      alert("Dealer wins!");
    }
  }
}


callButton.addEventListener("click", callNewCard);
passButton.addEventListener("click", passNewCard);
