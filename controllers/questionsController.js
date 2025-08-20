const sqlDal = require('../data/sqlDAL');

/**
 * Get all questions for viewing
 * @returns {Promise<Object[]>} 
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
 * @param {string} questionText 
 * @param {string} correctAnswer 
 * @param {string} incorrectAnswer1 
 * @param {string} incorrectAnswer2 
 * @param {string} incorrectAnswer3 
 * @returns {Promise<Object>} 
 */
exports.addQuestion = async function(questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    try {
        if (!questionText || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3) {
            return {
                status: 'failure',
                message: 'All fields are required'
            };
        }

        
        questionText = questionText.trim();
        correctAnswer = correctAnswer.trim();
        incorrectAnswer1 = incorrectAnswer1.trim();
        incorrectAnswer2 = incorrectAnswer2.trim();
        incorrectAnswer3 = incorrectAnswer3.trim();

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
 * @param {number} questionId 
 * @returns {Promise<Object>}
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
 * @param {number} questionId 
 * @param {string} questionText 
 * @param {string} correctAnswer 
 * @param {string} incorrectAnswer1 
 * @param {string} incorrectAnswer2 
 * @param {string} incorrectAnswer3 
 * @returns {Promise<Object>} 
 */
exports.updateQuestion = async function(questionId, questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    try {
        if (!questionText || !correctAnswer || !incorrectAnswer1 || !incorrectAnswer2 || !incorrectAnswer3) {
            return {
                status: 'failure',
                message: 'All fields are required'
            };
        }

        questionText = questionText.trim();
        correctAnswer = correctAnswer.trim();
        incorrectAnswer1 = incorrectAnswer1.trim();
        incorrectAnswer2 = incorrectAnswer2.trim();
        incorrectAnswer3 = incorrectAnswer3.trim();

        
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
 * @param {number} questionId 
 * @returns {Promise<Object>} 
 */
exports.deleteQuestion = async function(questionId) {
    try {
        return await sqlDal.deleteQuestion(questionId);
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};
