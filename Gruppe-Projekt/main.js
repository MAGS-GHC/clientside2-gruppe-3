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
        // After successful login
        if (data.message === 'Login succesfuldt') {
          fetch('http://localhost:5000/users')
            .then(response => response.json())
            .then(users => {
              const user = users.find(user => user.email === email);
              if (user) {
                // Store username and other attributes in localStorage
                localStorage.setItem('username', user.username);
                localStorage.setItem('email', user.email);
                localStorage.setItem('wallet', user.wallet);
                window.location.href = '/game';
              } else {
                console.error('User not found in the database');
                // Handle the case where the user is not found in the database
              }
            })
            .catch(error => {
              console.error('Error:', error);
              // Handle the error
            });
}

      })
      .catch(error => {
        console.error('Error logging in:', error);
        // Show error message
      });
  }
  