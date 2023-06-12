const email = 'danie@mail.dk';
const amount = 50;

fetch('/users/wallet/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, amount }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data.message); // Display success message
    // Update the prize pool display or perform any other necessary actions
  })
  .catch((error) => {
    console.error('Error updating wallet:', error);
    // Handle the error
  });
