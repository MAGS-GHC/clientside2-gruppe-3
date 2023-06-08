fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then((response) => response.json())
    .then((result) => {drawCard(result)})
    .catch((error) => console.log("error, error"));


/* fetch('https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=3')
    .then((response) => response.text())
    .then((result2) => console.log(result))
    .catch((error) => console.log("error", error));
console.log(result2); */
function drawCard(result) {
    console.log(result)
}

