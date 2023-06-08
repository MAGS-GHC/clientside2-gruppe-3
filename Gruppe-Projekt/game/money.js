const totalMoneyElement = document.getElementById('total-money');
const pileMoneyElement = document.getElementById('pile-money');
const jetonButtons = document.getElementsByClassName('jeton');

window.addEventListener('load', () => {

  
    let totalMoney = 1000;
    let pileOfMoney = 0;
  
    for (let i = 0; i < jetonButtons.length; i++) {
      jetonButtons[i].addEventListener('click', () => {
        const jetonValue = parseInt(jetonButtons[i].value);
        if (totalMoney >= jetonValue) {
          totalMoney -= jetonValue;
          pileOfMoney += jetonValue;
          totalMoneyElement.textContent = `Total Money: $${totalMoney}`;
          pileMoneyElement.textContent = `Pile: $${pileOfMoney}`;
        }
      });
    }
  });
  