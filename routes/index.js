var express = require('express');
var router = express.Router();

var uuid = require('uuid');

var dwolla = require('dwolla-node')('eTCy1flPfcjS8K+p1hAkJbCPCyI1T7crvFs+iegs7CwfRz8kZs', 'pbqq8QfDdQsA6Nf1mhKXkcVnT4vQLC+/YF9vdca6gGBhF8ue7W');
var redirect_uri = 'http://127.0.0.1:3000/oauthReturn';
dwolla.sandbox = true;

/* GET home page. */
router.get('/', function(req, res, next) {
  var challenges = req.db.get('challenge');

  challenges.insert({
    id: uuid.v4(),
    'timeCreated': new Date(),
    'timeBegin': null,
    'timeEnd': null,
    'timeElapsed': null,
    'name': null
  })

  .success(function(doc) {
    res.render('index', { 
      oauthURL: dwolla.authUrl(redirect_uri, 'Funding|AccountInfoFull|Send'),
      challengeId: doc.id
    });
  })

  .error(function(err) {
    res.render('error', { 'message': 'db connection broken?' });
  });
});

router.get('/oauthReturn', function(req, res) {
  dwolla.finishAuth(req.query.code, redirect_uri, function(error, auth) {
    console.dir(auth);
    dwolla.setToken(auth.access_token);

    res.render('oauthReturn');
  });
});

router.get('/finishChallenge', function(req, res) {
  res.render('finishChallenge', {

  });
});


module.exports = router;
