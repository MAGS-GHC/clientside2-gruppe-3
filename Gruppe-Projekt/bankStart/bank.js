// Player object to keep track of each player's money
function Player(name) {
    this.name = name;
    this.money = 500;
  }
  
  // Game object to manage the money pile and game logic
  function Game() {
    this.moneyPile = 0;
    this.players = [];
  
    // Add a player to the game
    this.addPlayer = function (name) {
      const player = new Player(name);
      this.players.push(player);
    };
  
    // Start a new game
    this.startGame = function () {
      this.moneyPile = 0;
    };
  
    // Player wins the game
    this.playerWins = function (playerIndex) {
      const player = this.players[playerIndex];
      player.money += this.moneyPile;
      this.moneyPile = 0;
      console.log(player.name + ' wins the game!');
    };
  
    // Player loses the game
    this.playerLoses = function (playerIndex) {
      const player = this.players[playerIndex];
      player.money -= this.moneyPile;
      this.moneyPile = 0;
      console.log(player.name + ' loses the game!');
    };
  
    // Add money to the pile
    this.addMoneyToPile = function (amount) {
      this.moneyPile += amount;
    };
  }
  
  // Usage example
  const game = new Game();
  
  // Add players
  game.addPlayer('Player 1');
  game.addPlayer('Player 2');
  
  // Start a new game
  game.startGame();
  
  // Add money to the pile
  game.addMoneyToPile(100);
  game.addMoneyToPile(200);
  
  // Player 1 wins the game
  game.playerWins(0);
  
  console.log('Player 1 money:', game.players[0].money);
  console.log('Player 2 money:', game.players[1].money);
  


