const sqlDal = require('../data/sqlDAL');
const Question = require('../models/questions').Question;

/**
 * Get a random set of trivia questions
 * @param {number} count - Number of questions to return (default: 10)
 * @param {string} difficulty - Difficulty level (easy, medium, hard) or null for any
 * @returns {Promise<Question[]>} Array of Question objects
 */
exports.getRandomQuestions = async function(count = 10, difficulty = null) {
    try {
        const questions = await sqlDal.getRandomQuestions(count, difficulty);
        return questions.map(q => new Question(
            q.QuestionId,
            q.QuestionText,
            q.CorrectAnswer,
            [q.IncorrectAnswer1, q.IncorrectAnswer2, q.IncorrectAnswer3],
            q.Category,
            q.Difficulty
        ));
    } catch (error) {
        console.error('Error getting random questions:', error);
        throw error;
    }
};

/**
 * Save a user's game score
 * @param {number} userId - User ID
 * @param {number} score - Score achieved
 * @param {number} questionsAnswered - Total questions answered
 * @returns {Promise<boolean>} Success status
 */
exports.saveUserScore = async function(userId, score, questionsAnswered) {
    try {
        return await sqlDal.saveUserScore(userId, score, questionsAnswered);
    } catch (error) {
        console.error('Error saving user score:', error);
        throw error;
    }
};

/**
 * Get leaderboard (top scores)
 * @param {number} limit - Number of top scores to return (default: 10)
 * @returns {Promise<Object[]>} Array of score objects with user info
 */
exports.getLeaderboard = async function(limit = 10) {
    try {
        return await sqlDal.getLeaderboard(limit);
    } catch (error) {
        console.error('Error getting leaderboard:', error);
        throw error;
    }
};

/**
 * Get a user's score history
 * @param {number} userId - User ID
 * @returns {Promise<Object[]>} Array of user's scores
 */
exports.getUserScores = async function(userId) {
    try {
        return await sqlDal.getUserScores(userId);
    } catch (error) {
        console.error('Error getting user scores:', error);
        throw error;
    }
};