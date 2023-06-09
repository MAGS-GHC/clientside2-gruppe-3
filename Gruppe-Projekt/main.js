document.getElementById('login-form').addEventListener('submit', loginUser);



function loginUser(event) {
    event.preventDefault();
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    const loginData = {
      email,
      password
    };

    console.log(loginData)
  
    fetch('http://localhost:5000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data.message);
        console.log('Login Response:', data);
        
        // Redirect to the dashboard folder if login is successful
        if (data.message === 'Login succesfuldt') {
          window.location.href = '/game';
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        // Show error message
      });
  }
  