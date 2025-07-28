const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const questionsController = require('../controllers/questionsController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;
const auth = require('../middleware/auth');
const security = require('../helpers/security');

router.use(auth.requireAdmin);

router.get('/users', async function (req, res, next) {
  let role = req.params.role;
  let users = await userController.getUsers(role);

  users = users.filter((u) => u.username != "admin");

  res.render('users', { title: 'Time 4 Trivia', user: req.session.user, isAdmin: security.isAdmin(req.session.user), users: users });
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

// Question management routes
router.get('/viewQuestions', async function (req, res, next) {
  try {
    const questions = await questionsController.getAllQuestions();
    res.render('viewQuestions', { 
      title: 'Time 4 Trivia', 
      user: req.session.user, 
      isAdmin: security.isAdmin(req.session.user), 
      questions: questions 
    });
  } catch (error) {
    console.error('Error viewing questions:', error);
    res.render('error', { message: 'Error loading questions', error: error });
  }
});

router.get('/editQuestion/:questionId', async function (req, res, next) {
  try {
    const questionId = req.params.questionId;
    const question = await questionsController.getQuestionById(questionId);
    
    if (!question) {
      return res.render('error', { message: 'Question not found', error: {} });
    }
    
    res.render('editQuestion', { 
      title: 'Time 4 Trivia', 
      user: req.session.user, 
      isAdmin: security.isAdmin(req.session.user), 
      question: question,
      error: '' 
    });
  } catch (error) {
    console.error('Error loading question for edit:', error);
    res.render('error', { message: 'Error loading question', error: error });
  }
});

router.post('/editQuestion/:questionId', async function (req, res, next) {
  try {
    const questionId = req.params.questionId;
    const { questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 } = req.body;
    
    const result = await questionsController.updateQuestion(
      questionId, 
      questionText, 
      correctAnswer, 
      incorrectAnswer1, 
      incorrectAnswer2, 
      incorrectAnswer3
    );
    
    if (result.status === STATUS_CODES.success) {
      res.redirect('/a/viewQuestions');
    } else {
      const question = await questionsController.getQuestionById(questionId);
      res.render('editQuestion', { 
        title: 'Time 4 Trivia', 
        user: req.session.user, 
        isAdmin: security.isAdmin(req.session.user), 
        question: question,
        error: result.message 
      });
    }
  } catch (error) {
    console.error('Error updating question:', error);
    res.render('error', { message: 'Error updating question', error: error });
  }
});

router.get('/deleteQuestion/:questionId', async function (req, res, next) {
  try {
    const questionId = req.params.questionId;
    await questionsController.deleteQuestion(questionId);
    res.redirect('/a/viewQuestions');
  } catch (error) {
    console.error('Error deleting question:', error);
    res.render('error', { message: 'Error deleting question', error: error });
  }
});

module.exports = router;
