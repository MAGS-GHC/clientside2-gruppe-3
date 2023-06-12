const navName = document.querySelector(".navbar-name");
const navWallet = document.querySelector(".navbar-wallet");
var storedName = localStorage.getItem("username");
var storedWwallet = localStorage.getItem("wallet");

navName.textContent = `${storedName}`
navWallet.textContent = `${storedWwallet}`



document.addEventListener("DOMContentLoaded", function() {    
    
    if (storedName) {
      document.getElementById("name").textContent = storedName;
    }
  });

  


  