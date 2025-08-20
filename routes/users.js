const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;
const security = require('../helpers/security');
const e = require('express');

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Time 4 Trivia', error: '' });
});

router.post('/register', async function (req, res, next) {
  let { username, email, password, firstname, lastname } = req.body;

  let result = await userController.createUser(username, email, password, firstname, lastname);

  if (result?.status == STATUS_CODES.success) {
    res.redirect('/u/login');
  } else {
    const errorMsg = result?.error?.code === 'ER_DUP_ENTRY'
            ? 'Email already in use'
            : 'Register Failed';
    res.render('register', { title: 'Time 4 Trivia', error: errorMsg });
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Time 4 Trivia', error: '' });
});

router.post('/login', async function (req, res) {
  const { username, password } = req.body;

  const result = await userController.login(username, password);
console.log('Login result:', result);



  if (result.status === STATUS_CODES.disabled) {
    return res.render('login', { title: 'Time 4 Trivia', error: 'This account has been disabled.' });
  }

  if (result.status === STATUS_CODES.success) {
    req.session.user = {
      userId: result.data.userId,
      firstname: result.data.firstname,
      lastname: result.data.lastname,
      username: result.data.username,
      role: result.data.role
    };
    console.log("Logged in role:", result.data.role);

    return res.redirect('/'); // or '/dashboard' if needed
  }

    console.log('Login query result:', result);
    console.log('Trying login with:', username, password);

  res.render('login', { title: 'Time 4 Trivia', error: 'Invalid Login. Please try again.' });
});


// router.post('/login', userController.login);

router.get('/logout', function (req, res, next) {
  // Clear session information
  req.session.destroy((err) => { if (err) { console.log(err); } });

  res.redirect('/');
});

router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: security.isAdmin(req.session.user), error: '' });
});

router.post('/profile', async function (req, res, next) {
  let current = req.body.currentPassword;
  let new1 = req.body.newPassword;
  let new2 = req.body.confirmPassword;

  if (new1 != new2) {
    res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: security.isAdmin(req.session.user), error: 'Password do not match' });
  } else {
    // console.log(`Changing passwor for userId ${req.session.user?.userId}`);
    let result = await userController.updateUserPassword(req.session.user.userId, current, new1, new2);
    if (result.status == STATUS_CODES.success) {
      res.redirect('/u/login');
    } else {
      res.render('profile', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: security.isAdmin(req.session.user), error: 'Password update failed' });
    }
  }
});

module.exports = router;

