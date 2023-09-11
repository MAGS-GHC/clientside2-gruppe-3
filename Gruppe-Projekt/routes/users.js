const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
app.post('/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
    } else {

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        username,
        email,
        password: hashedPassword,
        wallet: 500,
      };

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
    const user = await db.collection('users').findOne({ email });
    console.log('Fetched user:', user);
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid login credentials' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Could not fetch user' });
  }
});

app.get('/users', async (req, res) => {
    try {
      const users = await db.collection('users').find().toArray();
      res.status(200).json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Could not get users' });
    }
  });


  app.use('/users', router);
};
