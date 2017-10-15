require('dotenv').config();
var express = require('express');
let request = require('request-promise');

var router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.session.authorization) {
    res.redirect('/connect');
  } else {
    next();
  }
}

/* GET home page. */
router.get('/', checkAuth, (req, res, next) => {
  // res.render('index', { title: 'sign up for a dvar.' });
  // ask reddit for info about the user.
  request('https://oauth.reddit.com/api/v1/me', {
    method: 'GET',
    headers: {
      'Authorization': `bearer ${req.session.authorization.access_token}`,
      'User-Agent': 'webapp for the /r/judaism dvar torah project by /r/o_m_f_g'
    },
    json: true,
  })
  .then((response) => {
    req.session.me = response;
    res.render('home', {
      title: 'register to write a dvar.',
      name: response.name
    })
  })
  .catch((error) => {
    console.log(error);
  })
});

router.get('/connect', (req, res, next) => {
  res.render('index', { title: 'connect to reddit.'})
})

router.get('/authorize', (req, res, next) => {
  const { error, code, state } = req.query;

  const basicAuth = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64');

  if (!error) {
    request('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      formData: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI
      },
      headers: {
        'Authorization': `Basic ${basicAuth}`,
      },
      json: true,
    })
    .then((response) => {
      req.session.authorization = response;
      res.redirect('/');
    })
    .catch((error) => {
      console.log(error);
    })
  }
});

module.exports = router;
