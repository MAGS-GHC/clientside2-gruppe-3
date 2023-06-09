

const ApiFetch = () => {
    const url = `https://deckofcardsapi.com/api/deck/fpt57qkqg4c8/draw/?count=1`;
    const fetchApi = new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((result) => resolve(result))
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
    fetchApi.then((apiData) => {
        console.log(apiData)
        console.log(apiData.cards)
        let deck = apiData.cards.map( (card) => card);
        console.log(deck)
    });
}
ApiFetch()