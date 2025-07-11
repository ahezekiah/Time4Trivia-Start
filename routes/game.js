const express = require('express');
const router = express.Router();

router.get('/play', function(req, res, next) {
  // TODO: Implement Game
  
  res.render('play', {user: req.session.user, isAdmin: req.cookies.isAdmin});
});

module.exports = router;