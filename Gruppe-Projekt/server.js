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

  // Kryptér passwordet
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user object with the wallet attribute
  const newUser = {
    username,
    email,
    password: hashedPassword,
    wallet: 500, // Default value for the wallet attribute
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
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

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
