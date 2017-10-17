var express = require('express');
let request = require('request-promise');
const mongoose = require('mongoose');

var router = express.Router();

const { fetchUpcomingParashot } = require('../lib/hebcal');

router.get('/', (req, res, next) => {
  const options = {
    uri: 'https://oauth.reddit.com/api/v1/me',
    method: 'GET',
    headers: {
      'Authorization': `bearer ${req.session.authorization.access_token}`,
      'User-Agent': 'webapp for the /r/judaism dvar torah project by /r/o_m_f_g'
    },
    json: true,
  };

  Promise.all([
    request(options),
    fetchUpcomingParashot()
  ])
  .then(([me, parashot]) => {
      res.render('home', {
      title: 'register to write a dvar.',
      name: me.name,
      parashot,
    })
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/submit', (req, res, next) => {
  const { parashah, name } = req.body;

  // insert into database.
});


module.exports = router;
