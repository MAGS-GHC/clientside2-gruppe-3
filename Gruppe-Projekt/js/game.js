fetch('http://localhost:5000/users')
  .then(response => response.json())
  .then(data => {
    console.log(data[11].wallet);
    console.log(data[11].username);
    console.log(data[11].email);
    // Use the user data in your game logic here
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error
  });
