var express = require('express');
var router = express.Router();

var uuid = require('uuid');
var util = require('util');

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

  // TODO: generate challenge when button is clicked

  .success(function(doc) {
    res.render('index', { 
      oauthURL: dwolla.authUrl(
        util.format('%s?challengeId=%s', redirect_uri, doc.id), 
        'Funding|AccountInfoFull|Send')
    });
  })

  .error(function(err) {
    res.render('error', { 'message': 'db connection broken?' });
  });
});

router.get('/oauthReturn', function(req, res) {
  var challengeId = req.query.challengeId;
  var challenges = req.db.get('challenge');

  dwolla.finishAuth(req.query.code, util.format('%s?challengeId=%s', redirect_uri, challengeId), function(error, auth) {
    var timeEnd = new Date();

    console.dir(auth);

    challenges.findOne({ id: challengeId })

    .success(function(doc) {
      dwolla.setToken(auth.access_token);
      dwolla.fullAccountInfo(function(err, data) {
        if (err) { return res.render('error', err); }

        // TODO: check if accountid already exists, means already tried once
        // TODO: check if timeBegin already filled, means re-doing old session


        challenges.update({id: challengeId}, { $set: {
          timeEnd: timeEnd,
          timeElapsed: timeEnd - doc.timeCreated,  // TODO: replace with TimeBegin
          accessToken: auth.access_token,
          accountInfo: data
        }})
        .success(function(doc) {
          res.render('oauthReturn', {
            challengeId: challengeId
          });
        })
        .error(function(err) { res.render('error', err); });
      });
    })

    .error(function(err) { res.render('error', err); });
  });
});

router.get('/finishChallenge', function(req, res) {
  var challenges = req.db.get('challenge');
  var challengeId = req.query.challengeId;

  challenges.findOne({ id: challengeId })

  .success(function(doc) {
    res.render('finishChallenge', {
      challengeId: challengeId,
      doc: JSON.stringify(doc)
    });
  })

  .error(function(err) { res.render('error', err); });
});


module.exports = router;
