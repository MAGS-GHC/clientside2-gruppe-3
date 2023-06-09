

// const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`;
// const fetchApi = new Promise((resolve, reject) => {
//   fetch(url)
//     .then((response) => response.json())
//     .then((result) => resolve(result))
//     .catch((error) => {
//       console.log(error);
//       reject(error);
//     });
// });
// fetchApi.then((apiData) => {
// const allCards = () => {
//     const url = `https://deckofcardsapi.com/api/deck/${apiData.deck_id}/draw/?count=320`;
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
//         let deck = apiData.cards.map( (card) => card);
//         console.log(deck)
//     });
// }
// allCards()
// });

