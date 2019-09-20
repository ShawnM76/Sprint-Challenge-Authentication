const router = require('express').Router();
const Users = require('./auth-model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const TokenMW = require('./authenticate-middleware.js');

router.get('/users', TokenMW, (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, loggedInUser: req.user.username });
    })
    .catch(err => res.send(err));
});

router.post('/register', (req, res) => {
  // implement registration
  let { username, password } = req.body;

  const hash = bcrypt.hashSync(password, 14);

  Users.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  // implement login
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // token goes here
        const token = generateToken(user);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'You cannot pass!' });
      }
    });
});

function generateToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
