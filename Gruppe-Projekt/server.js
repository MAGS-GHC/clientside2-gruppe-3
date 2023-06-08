const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const mongoURI = 'mongodb+srv://' + encodeURIComponent('Daniel') + ':' + encodeURIComponent('DMS1997') + '@atlascluster.by0nbvr.mongodb.net/' + encodeURIComponent('Junkyard') + '?retryWrites=true&w=majority';
const dbName = 'Junk-players';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, dbName })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  wallet: Number,
});

const User = mongoose.model('User', userSchema);

// Serve the index.html file with user data
app.get('/game', (req, res) => {
  User.find()
    .then((users) => {
      res.sendFile(path.join(__dirname, 'game', 'index.html'));
    })
    .catch((error) => {
      console.error('Failed to retrieve user data', error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
