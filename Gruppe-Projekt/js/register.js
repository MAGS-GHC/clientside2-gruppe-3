document.getElementById('registerForm').addEventListener('submit', registerUser);
const errorMSG = document.getElementById('errorMessage');



function registerUser(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const userData = {
      username,
      email,
      password
    };
  
    console.log(userData)
  
    fetch('http://localhost:5000/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.message === 'Bruger registreret med succes') {

            alert('User was created. You will go to the game in 2 seconds after you click okay.');
      
           
            setTimeout(() => {
              window.location.href = '/game/index.html';
            }, 2000);
          }
          if(data.message === 'Email already exists'){
            errorMSG.innerHTML = `<p> Mailen fandtes allerede tryk <a href="../"> her </a> for at logge ind`;
          }   
          
          
      })
      .catch(error => {
        console.error('Error:', error);
       

      });
  }