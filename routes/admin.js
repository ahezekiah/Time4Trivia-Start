const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// All Admin Routes should only be accessble to logged in Admins!

router.get('/users', async function (req, res, next) {
  let role = req.params.role;
  let users = await userController.getUsers(role);

  // remote the admin username
  users = users.filter((u) => u.username != "admin");

  res.render('users', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: req.cookies.isAdmin, users: users });
});

router.get('/delete/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.deleteUserById(userId);

  res.redirect('/a/users');
});

router.get('/promote/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.promoteUser(userId);

  res.redirect('/a/users');
});

router.get('/demote/:userId', async function (req, res, next) {
  let userId = req.params.userId;

  await userController.demoteUser(userId);

  res.redirect('/a/users');
});

module.exports = router;
