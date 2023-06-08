const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

const mongoURI = 'mongodb+srv://Daniel:DMS1997@atlascluster.by0nbvr.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Junkyard';

let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/redirect', (req, res) => {
    res.sendFile(path.join(__dirname, 'game', 'index.html'));
  });
  

app.post('/users/register', (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Store user credentials in the database
  db.collection('users').insertOne({ username, email, password: hashedPassword })
    .then(result => {
      res.status(200).json({ message: 'User registered successfully' });
    })
    .catch(error => {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
    });
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with the specified email in the database
  db.collection('users')
    .findOne({ email })
    .then(user => {
      console.log('Retrieved User:', user);
      if (user) {
        // Compare the provided password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ message: 'Failed to compare passwords' });
          } else if (result) {
            // Passwords match, login successful
            res.status(200).json({ message: 'Login successful' });
          } else {
            // Passwords do not match
            res.status(401).json({ message: 'Invalid credentials' });
          }
        });
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error retrieving user:', error);
      res.status(500).json({ message: 'Failed to retrieve user' });
    });
});


app.get('/users', (req, res) => {
  // Retrieve all users from the database
  db.collection('users').find().toArray()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.error('Error retrieving users:', error);
      res.status(500).json({ message: 'Failed to retrieve users' });
    });
});

app.get('/users/username/:username', (req, res) => {
  const { username } = req.params;

  // Retrieve the user with the specified username from the database
  db.collection('users')
    .findOne({ username })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error retrieving user:', error);
      res.status(500).json({ message: 'Failed to retrieve user' });
    });
});

app.use(express.static(__dirname));

module.exports = {
  getUsers: (callback) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        callback(null, users);
      })
      .catch((error) => {
        console.error('Error retrieving users:', error);
        callback(error, null);
      });
  },
};
