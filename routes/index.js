require('dotenv').config();
var express = require('express');
let request = require('request-promise');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
      res.redirect('/secure');
    })
    .catch((error) => {
      console.log(error);
    })
  }
});

module.exports = router;
