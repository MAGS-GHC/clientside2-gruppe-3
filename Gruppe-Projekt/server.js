const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;
const mongoURI =
  'mongodb+srv://Daniel:DMS1997@atlascluster.by0nbvr.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Junkyard';

let db;

async function startServer() {
  try {
    // Establish connection to MongoDB
    const client = await MongoClient.connect(mongoURI, { useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Route for the root path ('/') - Send index.html file as response
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for '/redirect' path - Send game/index.html file as response
app.get('/redirect', (req, res) => {
  res.sendFile(path.join(__dirname, 'game', 'index.html'));
});

// Route for '/create' path - Send create/index.html file as response
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'create', 'index.html'));
});

app.post('/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists in the database
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      // Email already exists
      res.status(400).json({ message: 'Email already exists' });
    } else {
      // Email does not exist, proceed with user registration

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object with the wallet attribute
      const newUser = {
        username,
        email,
        password: hashedPassword,
        wallet: 500,
      };

      // Save user information in the database
      await db.collection('users').insertOne(newUser);
      res.status(200).json({ message: 'User registered successfully' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Could not register user' });
  }
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with the specified email in the database
    const user = await db.collection('users').findOne({ email });
    console.log('Fetched user:', user);
    if (user) {
      // Compare the provided password with the hashed password in the database
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        // Passwords match, login successful
        res.status(200).json({ message: 'Login successful' });
      } else {
        // Passwords do not match
        res.status(401).json({ message: 'Invalid login credentials' });
      }
    } else {
      // User not found
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Could not fetch user' });
  }
});

app.get('/users', async (req, res) => {
  try {
    // Get all users from the database
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Could not get users' });
  }
});

app.get('/users/username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Get the user with the specified username from the database
    const user = await db.collection('users').findOne({ username });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Could not fetch user' });
  }
});

app.put('/users/updateWallet/:username', async (req, res) => {
  const { username } = req.params;
  const newWallet = req.body.newWallet;

  try {
    // Find the user with the specified username and update the wallet
    const updatedUser = await db
      .collection('users')
      .findOneAndUpdate(
        { username },
        { $set: { wallet: newWallet } },
        { returnOriginal: false }
      );

    if (updatedUser) {
      res.status(200).json({ message: 'Wallet updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating wallet:', error);
    res.status(500).json({ message: 'Could not update wallet' });
  }
});

app.use(express.static(__dirname));

module.exports = {
  getUsers: async (callback) => {
    try {
      const users = await db.collection('users').find().toArray();
      callback(null, users);
    } catch (error) {
      console.error('Error getting users:', error);
      callback(error, null);
    }
  },
};

startServer();
