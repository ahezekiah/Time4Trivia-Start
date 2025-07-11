const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin });
});

router.get('/leaderboard', function(req, res, next) {
  // TODO: Get actual leader data from the MONGO database!
  let leaders = [
    {
      name: 'Sue', score: 100
    },
    {
      name: 'Don', score: 99
    },
    {
      name: 'Ralph', score: 3
    }
  ];
  res.render('leaderboard', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, leaders: leaders });
});

module.exports = router;