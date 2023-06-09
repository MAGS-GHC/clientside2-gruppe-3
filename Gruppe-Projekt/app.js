
class Deck {
    constructor(cards) {
        this.cards = cards;
    }  
}

class Shoe {
    constructor(deck) {
        this.deck = deck;
    }  
    dealTwoCards(){

    }
    dealTwoCardsOneFrontDown(){

    }
    dealOneCards(){

    }
}

class BasePlayer {
    constructor(id, username, email, wallet, cards) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.wallet = wallet;
        this.cards = cards;
    }
    hit() {

    }
    split() {

    }
    stand() {

    }
}

class Player extends BasePlayer {
    constructor(id, username, email, wallet, cards, currentCard) {
        super(id, username, email, wallet, cards);
        this.currentCard = null;
    }
    placeBet() {

    }
}
class Dealer extends BasePlayer {
    constructor(id, username, email, wallet, cards, currentCard) {
        super(id, username, email, wallet, cards);
        this.currentCard = null;
    }
    payOutBet() {

    }
    takeBet() {

    }
}

class Game {
    constructor() {
        this.shoe = new Shoe();
        this.player = new Player();
        this.botPlayer = new Dealer();
    }  
    start() {

    }
    addPlayer(){

    }
    addBotPlayer(){

    }
    addShoe() {

    }
}
let newDeck = {};
const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
const fetchApi = new Promise((resolve, reject) => {
  fetch(url)
    .then((response) => response.json())
    .then((result) => resolve(result))
    .catch((error) => {
      console.log(error);
      reject(error);
    });
});
fetchApi.then((apiData) => {
const allCards = () => {
    const url = `https://deckofcardsapi.com/api/deck/${apiData.deck_id}/draw/?count=320`;
    const fetchApi = new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
    fetchApi.then((apiData) => {
        let deck = apiData.cards.map( (card) => card);
        console.log(deck)
        //let newDeck = {};
        for(let i = 0; i < deck.length; i++){
            newDeck = new Deck(deck); 
        }
        console.log(newDeck)
    });
}
allCards()
});

