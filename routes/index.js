const express = require('express');
const router = express.Router();
const triviaController = require('../controllers/triviaController');
const security = require('../helpers/security');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: security.isAdmin(req.session.user) });
});

router.get('/leaderboard', async function(req, res, next) {
  try {
    const leaders = await triviaController.getLeaderboard(10);
    res.render('leaderboard', { 
      title: 'Time 4 Trivia', 
      user: req.session.user, 
      isAdmin: security.isAdmin(req.session.user), 
      leaders: leaders 
    });
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    res.render('error', { message: 'Error loading leaderboard', error: error });
  }
});

module.exports = router;