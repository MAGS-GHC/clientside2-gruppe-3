
class Deck {
    constructor() {

    }  
}
class Shoe {
    constructor() {
        this.deck = new Deck();
    }  
    dealTwoCards(){

    }
    dealOneCards(){

    }
}

class BasePlayer {
    constructor(id, name, cards, balance) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.balance = balance;
    }
    hit() {

    }
    split() {

    }
    stand() {

    }
}

class Player extends BasePlayer {
    constructor(id, name, cards, balance, currentCard) {
        super(id, name, cards, balance);
        this.currentCard = null;
    }
    placeBet() {

    }
}
class BotPlayer extends BasePlayer {
    constructor(id, name, deck, balance, currentCard) {
        super(id, name, deck, balance);
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
        this.botPlayer = new BotPlayer();
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

