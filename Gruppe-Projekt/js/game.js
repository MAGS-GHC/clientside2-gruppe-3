const username = localStorage.getItem('username');

if (username) {
  console.log('Username:', username);
  // Fetch the user's data using the username if needed
} else {
  // Handle the case where the username is not available in localStorage
}
