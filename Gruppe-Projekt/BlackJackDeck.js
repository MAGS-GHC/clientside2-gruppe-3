const cardContainer = document.querySelector(".cards");



fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then((response) => response.json())
    .then((result) => {drawCard(result)})
    .catch((error) => console.log("error, error"));



function drawCard(result) {
    console.log(result.deck_id)
    fetch(`https://deckofcardsapi.com/api/deck/${result.deck_id}/draw/?count=2`)
    .then((response) => response.json())
    .then((result) => {printCard(result)})
    .catch((error) => console.log("error", error));

}   
function printCard(result) {

    for(let i = 0; i < result.cards.length; i++){

    cardContainer.innerHTML +=`
    <div class="cardWrapping">
    <img src="${result.cards[i].image}" alt="" class="card_image">
    </div>`
    }

}




