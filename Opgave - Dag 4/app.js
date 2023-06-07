function fetchCompanyData() {
  var userInput = document.getElementById("companyInput").value;

  if (!isValidInput(userInput)) {
    alert("Invalid input. Please enter a valid 8-digit number.");
    return;
  }

  var companyCard = document.getElementById("companyCard");
  while (companyCard.firstChild) {
    companyCard.removeChild(companyCard.firstChild);
  }

  showLoader();

  fetch("https://cvrapi.dk/api?country=dk&search=" + userInput)
    .then(response => response.json())
    .then(data => {
      setTimeout(function() {
        var card = document.createElement("div");
        card.innerHTML = `
          <h3>${data.name}</h3>
          <p>Phone: ${data.phone}</p>
          <p>Employees: ${data.employees}</p>
          <p>Start Date: ${data.startdate}</p>
          <p>Credit Bankrupt: ${data.creditbankrupt}</p>
          <p>Company Description: ${data.companydesc}</p>
        `;

        fadeIn(card, 500);
        document.getElementById("companyCard").appendChild(card);
        setTimeout(function() {
          hideLoader();
        }, 1500); // Adjust the delay timing here (e.g., 1500ms for 1.5 seconds)
      }, 2000); // Loader runs for 2 seconds before showing the card
    })
    .catch(error => {
      console.error("Error:", error);
      hideLoader();
    });
}

function showLoader() {
  var loader = document.getElementById("loader");
  loader.style.display = "block";
  fadeIn(loader, 500);
}

function hideLoader() {
  var loader = document.getElementById("loader");
  fadeOut(loader, 500, function() {
    loader.style.display = "none";
  });
}

// Utility functions for fading in and out
function fadeIn(element, duration) {
  element.style.opacity = 0;
  var startTime = performance.now();

  function step(currentTime) {
    var elapsedTime = currentTime - startTime;
    var progress = elapsedTime / duration;

    element.style.opacity = Math.min(progress, 1);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function fadeOut(element, duration, callback) {
  element.style.opacity = 1;
  var startTime = performance.now();

  function step(currentTime) {
    var elapsedTime = currentTime - startTime;
    var progress = elapsedTime / duration;

    element.style.opacity = Math.max(1 - progress, 0);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (typeof callback === "function") {
        callback();
      }
    }
  }

  requestAnimationFrame(step);
}

function isValidInput(input) {
  return /^\d{8}$/.test(input);
}
