fetch('https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=3')
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
console.log(result);