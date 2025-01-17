
const axios = require('axios');
const db = require('./model');
// token gen
const jwt = require('jsonwebtoken');
// hash pw using bcrypt
const bcrypt = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};


function register(req, res) {
  const newuser = req.body;
  const hash = bcrypt.hashSync(newuser.password, 10);
  newuser.password = hash;
  db.register(newuser)
  .then(user => {
    res.status(201).json({success: true, message: 'Successfully Registered.' ,user})
  })
  .catch(err => {
    res.status(500).json(errorRef(err))
  })
}

function login(req, res) {
  const {username, password} = req.body;

  db.login({username})
  .then(user => {
    if(user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        subject: user.id,
        username: user.username,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET) 

      res.status(200).json({success: true, message: `${user.username} has logged in Successfully!`, token})
    }else {
        res.status(401).json({success: false, message: 'invalid credentials.'})
    }
  })
  .catch(err => {
    res.status(500).json(errorRef(err))
  })
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

// Error Middleware
const errorRef = (error) => {
  const hash = Math.random().toString(36).substring(2);
  console.log(hash, error)
  return { message: `\n\nUnknown Error, Ref: ${hash}\n\n`, error }
}
