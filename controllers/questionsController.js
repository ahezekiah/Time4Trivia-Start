const sqlDal = require('../data/sqlDAL');

/**
 * Get all questions for viewing
 * @returns {Promise<Object[]>} Array of question objects
 */
exports.getAllQuestions = async function() {
    try {
        return await sqlDal.getAllQuestions();
    } catch (error) {
        console.error('Error getting all questions:', error);
        throw error;
    }
};

/**
 * Add a new question
 * @param {string} questionText - The question text
 * @param {string} correctAnswer - The correct answer
 * @param {string} incorrectAnswer1 - First incorrect answer
 * @param {string} incorrectAnswer2 - Second incorrect answer
 * @param {string} incorrectAnswer3 - Third incorrect answer
 * @returns {Promise<Object>} Result object with status and message
 */
exports.addQuestion = async function(questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    try {
        // Validate inputs
        if (!questionText || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3) {
            return {
                status: 'failure',
                message: 'All fields are required'
            };
        }

        // Trim whitespace
        questionText = questionText.trim();
        correctAnswer = correctAnswer.trim();
        incorrectAnswer1 = incorrectAnswer1.trim();
        incorrectAnswer2 = incorrectAnswer2.trim();
        incorrectAnswer3 = incorrectAnswer3.trim();

        // Check if answers are unique
        const answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
        const uniqueAnswers = [...new Set(answers.map(a => a.toLowerCase()))];
        
        if (uniqueAnswers.length !== 4) {
            return {
                status: 'failure',
                message: 'All answers must be unique'
            };
        }

        return await sqlDal.addQuestion(questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3);
    } catch (error) {
        console.error('Error adding question:', error);
        throw error;
    }
};

/**
 * Get a question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Question object
 */
exports.getQuestionById = async function(questionId) {
    try {
        return await sqlDal.getQuestionById(questionId);
    } catch (error) {
        console.error('Error getting question by ID:', error);
        throw error;
    }
};

/**
 * Update an existing question
 * @param {number} questionId - Question ID
 * @param {string} questionText - The question text
 * @param {string} correctAnswer - The correct answer
 * @param {string} incorrectAnswer1 - First incorrect answer
 * @param {string} incorrectAnswer2 - Second incorrect answer
 * @param {string} incorrectAnswer3 - Third incorrect answer
 * @returns {Promise<Object>} Result object with status and message
 */
exports.updateQuestion = async function(questionId, questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    try {
        // Validate inputs
        if (!questionText || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3) {
            return {
                status: 'failure',
                message: 'All fields are required'
            };
        }

        // Trim whitespace
        questionText = questionText.trim();
        correctAnswer = correctAnswer.trim();
        incorrectAnswer1 = incorrectAnswer1.trim();
        incorrectAnswer2 = incorrectAnswer2.trim();
        incorrectAnswer3 = incorrectAnswer3.trim();

        // Check if answers are unique
        const answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
        const uniqueAnswers = [...new Set(answers.map(a => a.toLowerCase()))];
        
        if (uniqueAnswers.length !== 4) {
            return {
                status: 'failure',
                message: 'All answers must be unique'
            };
        }

        return await sqlDal.updateQuestion(questionId, questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3);
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

/**
 * Delete a question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Result object with status and message
 */
exports.deleteQuestion = async function(questionId) {
    try {
        return await sqlDal.deleteQuestion(questionId);
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};
