const cardContainer = document.querySelector(".cards");
const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");

let count = 6;
let deckID;



fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`)
    .then((response) => response.json())
    .then((result) => {
        deckID = result.deck_id;
        count = 2;
        drawCard()
        console.log(count)
        console.log(deckID)

    
    })
    .catch((error) => console.log("error, error"));


    console.log(deckID)

function drawCard(result) {
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`)
    .then((response) => response.json())
    .then((result) => {
        printCard(result)
        count = 1;
    })
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

function callNewcard(result){
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then((response) => response.json())
    .then((result) => {printCard(result)})
    .catch((error) => console.log("error", error));
    
}



