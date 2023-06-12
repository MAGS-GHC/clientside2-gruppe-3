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

// Opret forbindelse til MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
  .then(client => {
    console.log('Forbundet til MongoDB');
    db = client.db(dbName);
    app.listen(PORT, () => {
      console.log(`Serveren kører på port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Fejl ved forbindelse til MongoDB:', err);
  });

// Angiv en rute til rodstien ('/') og send index.html-filen som svar
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Angiv en rute til '/redirect'-stien og send game/index.html-filen som svar
app.get('/redirect', (req, res) => {
  res.sendFile(path.join(__dirname, 'game', 'index.html'));
});

// Angiv en rute til '/create'-stien og send create/index.html-filen som svar
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'create', 'index.html'));
});

app.post('/users/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if email already exists in the database
  db.collection('users')
    .findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        // Email already exists
        res.status(400).json({ message: 'Email already exists' });
      } else {
        // Email does not exist, proceed with user registration

        // Kryptér passwordet
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user object with the wallet attribute
        const newUser = {
          username,
          email,
          password: hashedPassword,
          wallet: 500, 
        };

        // Gem brugeroplysninger i databasen
        db.collection('users').insertOne(newUser)
          .then(result => {
            res.status(200).json({ message: 'Bruger registreret med succes' });
          })
          .catch(error => {
            console.error('Fejl ved registrering af bruger:', error);
            res.status(500).json({ message: 'Kunne ikke registrere bruger' });
          });
      }
    })
    .catch(error => {
      console.error('Error checking email existence:', error);
      res.status(500).json({ message: 'Error checking email existence' });
    });
});


app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  console.log(password)

  // Find brugeren med den specificerede email i databasen
  db.collection('users')
    .findOne({ email })
    .then(user => {
      console.log('Hentet bruger:', user);
      if (user) {
        // Sammenlign det angivne password med det krypterede password i databasen
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            console.error('Fejl ved sammenligning af passwords:', err);
            res.status(500).json({ message: 'Kunne ikke sammenligne passwords' });
          } else if (result) {
            // Passwords matcher, login succesfuldt
            res.status(200).json({ message: 'Login succesfuldt' });
          } else {
            // Passwords matcher ikke
            console.log(user)
            res.status(401).json({ message: 'Ugyldige loginoplysninger' });
          }
        });
      } else {
        // Bruger ikke fundet
        res.status(404).json({ message: 'Bruger ikke fundet' });
      }
    })
    .catch(error => {
      console.error('Fejl ved hentning af bruger:', error);
      res.status(500).json({ message: 'Kunne ikke hente bruger' });
    });
});


app.get('/users', (req, res) => {
  // Hent alle brugere fra databasen
  db.collection('users').find().toArray()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.error('Fejl ved hentning af brugere:', error);
      res.status(500).json({ message: 'Kunne ikke hente brugere' });
    });
});

app.get('/users/username/:username', (req, res) => {
  const { username } = req.params;

  // Hent brugeren med det specificerede brugernavn fra databasen
  db.collection('users')
    .findOne({ username })
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Bruger ikke fundet' });
      }
    })
    .catch(error => {
      console.error('Fejl ved hentning af bruger:', error);
      res.status(500).json({ message: 'Kunne ikke hente bruger' });
    });
});

app.post('/users/wallet/update', (req, res) => {
  const { email, amount } = req.body;

  // Retrieve the user from the database based on the email
  db.collection('users')
    .findOne({ email })
    .then((user) => {
      if (user) {
        // Deduct the amount from the user's wallet balance
        const newBalance = user.wallet - amount;

        // Update the user's wallet balance in the database
        db.collection('users')
          .updateOne(
            { email },
            { $set: { wallet: newBalance } }
          )
          .then(() => {
            // Return success message
            res.status(200).json({ message: 'Wallet updated successfully' });
          })
          .catch((error) => {
            console.error('Error updating wallet:', error);
            res.status(500).json({ message: 'Error updating wallet' });
          });
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res.status(500).json({ message: 'Error finding user' });
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
        console.error('Fejl ved hentning af brugere:', error);
        callback(error, null);
      });
  },
};
