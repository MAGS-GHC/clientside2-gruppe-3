const cardContainer = document.querySelector(".cards");
const passButton = document.querySelector(".pass");
const callButton = document.querySelector(".call");
const combinedScore = document.querySelector(".cards");

let count = 6;
let deckID;
let score = 0;
let card1Value;
let card2Value;
/* let card3Value;
let card4Value;
let card5value; */
let totalCardValue;

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
    
    score = (parseInt(result.cards[i].value));
    if(result.cards[i].value == "JACK"){
        score = 10;
    }
    if(result.cards[i].value == "QUEEN"){
        score = 10;
    }
    if(result.cards[i].value == "KING"){
        score = 10;
    }
    if(result.cards[i].value == "ACE"){
        score = 1;
    }

    card1Value = (parseInt(result.cards[0].value));
    card2Value = (parseInt(result.cards[1].value));
   /*  card3Value = (parseInt(result.cards[2].value));
    card4Value = (parseInt(result.cards[3].value));
    card5value = (parseInt(result.cards[4].value)); */
    totalCardValue = card1Value + card2Value;

    console.log(totalCardValue)
    
    
        
    cardContainer.innerHTML +=`
    <div class="cardWrapping">
    <img src="${result.cards[i].image}" alt="" class="card_image">
    </div>`

    combinedScore.innerHTML +=`
    <h1> 
    
    `

    }

}

function callNewcard(result){
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then((response) => response.json())
    .then((result) => {printCard(result)})
    .catch((error) => console.log("error", error));
    
}

function passNewcard(result){

}





