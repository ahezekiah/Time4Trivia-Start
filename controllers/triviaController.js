const sqlDal = require('../data/sqlDAL');
const Question = require('../models/questions').Question;

/**
 * Get a random set of trivia questions
 * @param {number} count 
 * @returns {Promise<Question[]>} 
 */
exports.getRandomQuestions = async function(count = 10) {
    try {
        const questions = await sqlDal.getRandomQuestions(count);
        return questions.map(q => new Question(
            q.QuestionId,
            q.QuestionText,
            q.CorrectAnswer,
            [q.IncorrectAnswer1, q.IncorrectAnswer2, q.IncorrectAnswer3]
        ));
    } catch (error) {
        console.error('Error getting random questions:', error);
        throw error;
    }
};

/**
 * Save a user's game score
 * @param {number} userId
 * @param {number} score
 * @param {number} questionsAnswered
 * @returns {Promise<boolean>}
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
 * @param {number} limit
 * @returns {Promise<Object[]>}
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
 * @param {number} userId
 * @returns {Promise<Object[]>}
 */
exports.getUserScores = async function(userId) {
    try {
        return await sqlDal.getUserScores(userId);
    } catch (error) {
        console.error('Error getting user scores:', error);
        throw error;
    }
};