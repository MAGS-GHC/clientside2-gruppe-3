
// const ApiFetch = () => {
//     const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
//     const fetchApi = new Promise((resolve, reject) => {
//       fetch(url)
//         .then((response) => response.json())
//         .then((result) => resolve(result))
//         .catch((error) => {
//           console.log(error);
//           reject(error);
//         });
//     });
//     fetchApi.then((apiData) => {
//         console.log("hej")
//         apiData = data.map( (card) => card.suit);
//     });
// }
fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`)
    .then((response) => response.json())
    .then((result) => {

        console.log(result)
        let result1 = result.map( (card) => card.suit);
        console.log(result1)
    })
    .catch((error) => console.log("error", error));

