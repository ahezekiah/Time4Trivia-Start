const express = require('express');
const router = express.Router();
const triviaController = require('../controllers/triviaController');
const auth = require('../middleware/auth');
const security = require('../helpers/security');

// auth
router.use(auth.requireAuth);

// YATES SHUFFLE RAAAAAH
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getShuffledAnswers(question) {
  const allAnswers = [question.correctAnswer, ...question.incorrectAnswers];
  return shuffleArray(allAnswers);
}

router.get('/play', async function(req, res, next) {
  try {
    // Authentication is handled by middleware - no need to check here

    // Get random questions for the game (default 10 questions)
    const questions = await triviaController.getRandomQuestions(10);
    
    // Store questions in session for the game
    req.session.gameQuestions = questions;
    req.session.currentQuestionIndex = 0;
    req.session.score = 0;
    req.session.gameStarted = true;

    res.render('play', {
      user: req.session.user,
      isAdmin: security.isAdmin(req.session.user),
      questions: questions,
      currentQuestion: questions[0],
      currentQuestionAnswers: getShuffledAnswers(questions[0]),
      currentIndex: 0,
      totalQuestions: questions.length,
      score: 0
    });
  } catch (error) {
    console.error('Error starting trivia game:', error);
    res.render('error', { message: 'Error loading trivia game', error: error });
  }
});

// Route to handle answer submission
router.post('/answer', function(req, res, next) {
  try {
    // Check if user is logged in and game is active
    if (!req.session.user || !req.session.gameStarted) {
      return res.redirect('/g/play');
    }

    const { answer, questionId } = req.body;
    const questions = req.session.gameQuestions;
    const currentIndex = req.session.currentQuestionIndex;
    const currentQuestion = questions[currentIndex];

    let isCorrect = false;
    
    // Check if answer is correct
    if (currentQuestion && currentQuestion.correctAnswer.toLowerCase().trim() === answer.toLowerCase().trim()) {
      req.session.score += 1;
      isCorrect = true;
    }

    // Move to next question
    req.session.currentQuestionIndex += 1;
    const nextIndex = req.session.currentQuestionIndex;

    // Check if game is finished
    if (nextIndex >= questions.length) {
      // Game finished, redirect to results
      return res.redirect('/g/results');
    }

    // Continue with next question
    const nextQuestion = questions[nextIndex];
    
    res.render('play', {
      user: req.session.user,
      isAdmin: security.isAdmin(req.session.user),
      questions: questions,
      currentQuestion: nextQuestion,
      currentQuestionAnswers: getShuffledAnswers(nextQuestion),
      currentIndex: nextIndex,
      totalQuestions: questions.length,
      score: req.session.score,
      lastAnswer: {
        wasCorrect: isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: answer
      }
    });

  } catch (error) {
    console.error('Error processing answer:', error);
    res.render('error', { message: 'Error processing answer', error: error });
  }
});

// Route to display game results
router.get('/results', async function(req, res, next) {
  try {
    // Check if user completed a game
    if (!req.session.user || !req.session.gameStarted) {
      return res.redirect('/g/play');
    }

    const score = req.session.score || 0;
    const totalQuestions = req.session.gameQuestions ? req.session.gameQuestions.length : 0;

    // Save score to database
    if (totalQuestions > 0) {
      await triviaController.saveUserScore(req.session.user.userId, score, totalQuestions);
    }

    // Get updated leaderboard
    const leaderboard = await triviaController.getLeaderboard(10);

    // Clear game session data
    delete req.session.gameQuestions;
    delete req.session.currentQuestionIndex;
    delete req.session.score;
    delete req.session.gameStarted;

    res.render('results', {
      user: req.session.user,
      isAdmin: security.isAdmin(req.session.user),
      score: score,
      totalQuestions: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0,
      leaderboard: leaderboard
    });

  } catch (error) {
    console.error('Error displaying results:', error);
    res.render('error', { message: 'Error displaying results', error: error });
  }
});

// Route to get leaderboard
router.get('/leaderboard', async function(req, res, next) {
  try {
    const leaderboard = await triviaController.getLeaderboard(20);
    
    res.render('leaderboard', {
      user: req.session.user,
      isAdmin: security.isAdmin(req.session.user),
      leaderboard: leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.render('error', { message: 'Error loading leaderboard', error: error });
  }
});

module.exports = router;