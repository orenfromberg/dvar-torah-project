require('dotenv').config();
var express = require('express');
let request = require('request-promise');
const secure = require('./secure');

var router = express.Router();

const checkAuth = (req, res, next) => {
  if (!req.session.authorization) {
    res.redirect('/');
  } else {
    next();
  }
}

router.use('/secure', checkAuth, secure);

router.get('/', (req, res, next) => {
  res.render('index', { title: 'connect to reddit.'})
});

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
      res.redirect('/secure');
    })
    .catch((error) => {
      console.log(error);
    })
  }
});

module.exports = router;
