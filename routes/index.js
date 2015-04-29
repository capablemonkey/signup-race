var express = require('express');
var router = express.Router();

var uuid = require('uuid');
var util = require('util');

var config = require('../config.js');
var dwolla = require('dwolla-node')(config.dwolla.client_id, config.dwolla.client_secret);
var redirect_uri = config.host + '/oauthReturn';
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
          money: 4595,
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
  var payments = req.db.get('payment');
  var challengeId = req.query.challengeId;

  challenges.findOne({ id: challengeId })

  .success(function(c) {
    // TODO: make sure reward wasn't already sent for this challenge

    // send reward
    dwolla.setToken(config.dwolla.senderAccessToken);
    dwolla.send(config.dwolla.senderPIN, c.accountInfo.Id, c.money, {
      notes: 'thanks for taking the dwolla onboarding challenge!',
      assumeCosts: true
    }, function(err, txid) {
      if (err) { return res.render('error', err); }

      dwolla.transactionById(txid, function(err, data) {
        if (err) { return txid.render('error', err); }

        // record payment
        payments.insert({
          challengeId: challengeId,
          amount: c.money,
          destinationId: c.accountInfo.Id,
          transaction: data
        });

        res.render('finishChallenge', {
          challengeId: challengeId,
          challenge: JSON.stringify(c),
          transaction: JSON.stringify(data)
        });

      });
    });
  })

  // TODO: promisify
  // TODO: save time, calculate money based on elapsed time 
  // TODO: build leaderboard, calculate rank on leaderboard

  .error(function(err) { res.render('error', err); });
});


module.exports = router;
