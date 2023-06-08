document.getElementById('registerForm').addEventListener('submit', registerUser);
document.getElementById('login-form').addEventListener('submit', loginUser);

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
      // Handle the response data as needed
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error
    });
}

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
        console.log(data.message);
        console.log('Login Response:', data);
        
        // Redirect to the dashboard folder if login is successful
        if (data.message === 'Login successful') {
          window.location.href = '/dashboard';
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        // Show error message
      });
  }
  