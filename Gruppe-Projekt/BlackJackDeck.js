fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then((response) => response.json())
    .then((result) => {drawCard(result)})
    .catch((error) => console.log("error, error"));



function drawCard(result) {
    console.log(result.deck_id)
    fetch(`https://deckofcardsapi.com/api/deck/${result.deck_id}/draw/?count=2`)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}   

function shuffleRemaining() {
    fetch(`https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/?remaining=true`)
    .then((response) => response.json())
    .then((result2) => console.log(result2))
    .catch((error) => console.log("error", error));


}


