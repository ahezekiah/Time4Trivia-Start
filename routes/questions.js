const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;
const auth = require('../middleware/auth');
const security = require('../helpers/security');

// Route to show the add question form - anyone can access
router.get('/addQuestions', function (req, res, next) {
  res.render('addQuestions', { 
    title: 'Time 4 Trivia', 
    user: req.session.user, 
    isAdmin: security.isAdmin(req.session.user),
    error: '',
    success: ''
  });
});

// Route to handle adding a new question
router.post('/addQuestions', async function (req, res, next) {
  try {
    const { questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 } = req.body;
    
    const result = await questionsController.addQuestion(
      questionText, 
      correctAnswer, 
      incorrectAnswer1, 
      incorrectAnswer2, 
      incorrectAnswer3
    );
    
    if (result.status === STATUS_CODES.success) {
      res.render('addQuestions', { 
        title: 'Time 4 Trivia', 
        user: req.session.user, 
        isAdmin: security.isAdmin(req.session.user),
        error: '',
        success: 'Question added successfully!'
      });
    } else {
      res.render('addQuestions', { 
        title: 'Time 4 Trivia', 
        user: req.session.user, 
        isAdmin: security.isAdmin(req.session.user),
        error: result.message,
        success: ''
      });
    }
  } catch (error) {
    console.error('Error adding question:', error);
    res.render('addQuestions', { 
      title: 'Time 4 Trivia', 
      user: req.session.user, 
      isAdmin: security.isAdmin(req.session.user),
      error: 'An error occurred while adding the question',
      success: ''
    });
  }
});

// Route to view all questions (accessible to all users)
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

module.exports = router;
