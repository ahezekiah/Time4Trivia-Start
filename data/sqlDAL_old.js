// sqlDAL is responsible to for all interactions with mysql for Membership
const User = require('../models/user').User;
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

const mysql = require('mysql2/promise');
const sqlConfig = {
    host: 'localhost',
    user: 'AFGLRT',
    password: 'w0RDp4Ss',
    database: 'Time4Trivia',
    multipleStatements: true
};

/**
 * @returns and array of user models
 */
exports.getAllUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users;`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            users.push(new User(u.UserId, u.Username, u.Email, u.Password, roles));
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
 exports.getUsers = async function () {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
            console.log(user)
            users.push(user);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @returns and array of user models
 */
 exports.getUsersByRole = async function (role) {
    users = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = '${role}'`;

        const [userResults, ] = await con.query(sql);

        // console.log('getAllUsers: user results');
        // console.log(userResults);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            // console.log('getAllUsers: role results');
            // console.log(roleResults);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
            console.log(user)
            users.push(user);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return users;
}

/**
 * @param {*} userId the userId of the user to find
 * @returns a User model or null if not found
 */
exports.getUserById = async function (userId) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where UserId = ${userId}`;
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

exports.deleteUserById = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `delete from Users where UserId = ${userId}`;
        result = await con.query(sql);
        // console.log(result);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} delted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

exports.promoteUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `insert into UserRoles (UserId, RoleId) values ('${userId}', 2)`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} promoted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

exports.demoteUser = async function (userId) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `delete from UserRoles where UserId = ${userId}`;
        let result = await con.query(sql);
        // console.log(result);

        sql = `insert into UserRoles (UserId, RoleId) values ('${userId}', 1)`;
        const userResult = await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} promoted!`;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
    }finally{
        con.end();
    }

    return result;
}

/**
 * @param {*} username the username of the user to find
 * @returns a User model or null if not found
 */
exports.getUserByUsername = async function (username) {
    let user = null;

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where Username = '${username}'`;
        console.log(sql);
        
        const [userResults, ] = await con.query(sql);

        for(key in userResults){
            let u = userResults[key];

            let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ${u.UserId}`;
            console.log(sql);
            const [roleResults, ] = await con.query(sql);

            let roles = [];
            for(key in roleResults){
                let role = roleResults[key];
                roles.push(role.Role);
            }
            user = new User(u.UserId, u.Username, u.Email, u.Password, roles);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return user;
}

/**
 * @param {*} userId the userId of the user to find roles for
 * @returns an array of role names
 */
exports.getRolesByUserId = async function (userId) {
    results = [];

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ${userId}`;

        const [results, ] = await con.query(sql);

        for(key in results){
            let role = results[key];
            results.push(role.Role);
        }
    } catch (err) {
        console.log(err);
    }finally{
        con.end();
    }

    return results;
}

/**
 * @param {*} username 
 * @param {*} hashedPassword 
 * @param {*} email 
 * @returns a result object with status/message
 */
exports.createUser = async function (username, hashedPassword, email) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `insert into Users (Username, Email, Password, FirstName, LastName) values ('${username}', '${email}', '${hashedPassword}', '', '')`;
        const userResult = await con.query(sql);

        let newUserId = userResult[0].insertId;

        sql = `insert into UserRoles (UserId, RoleId) values (${newUserId}, 1)`;
        await con.query(sql);

        result.status = STATUS_CODES.success;
        result.message = 'Account Created with User Id: ' + newUserId;
        result.data = newUserId;
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        con.end();
    }
}

/**
 * 
 * @param {*} userId 
 * @param {*} hashedPassword 
 * @returns a result object with status/message
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
    let result = new Result();

    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `update Users set password = '${hashedPassword}' where userId = '${userId}'`;
        const userResult = await con.query(sql);

        // console.log(r);
        result.status = STATUS_CODES.success;
        result.message = 'Account updated';
        return result;
    } catch (err) {
        console.log(err);

        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    }finally{
        await con.end();
    }
}

/**
 * Get random trivia questions from the database
 * @param {number} count - Number of questions to return
 * @returns {Promise<Object[]>} Array of question objects
 */
exports.getRandomQuestions = async function(count = 10) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        // For better performance with large datasets, we could use:
        // 1. Get total count of questions
        // 2. Generate random offsets and select specific questions
        // But for typical trivia game sizes, ORDER BY RAND() is perfectly fine
        
        let sql = `SELECT QuestionId, QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3 
                   FROM Questions
                   ORDER BY RAND() LIMIT ${count}`;
        
        const [results] = await con.query(sql);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Save a user's game score to the database
 * @param {number} userId - User ID
 * @param {number} score - Score achieved
 * @param {number} questionsAnswered - Total questions answered
 * @returns {Promise<boolean>} Success status
 */
exports.saveUserScore = async function(userId, score, questionsAnswered) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `INSERT INTO UserScores (UserId, Score, QuestionsAnswered) VALUES (${userId}, ${score}, ${questionsAnswered})`;
        
        const [result] = await con.query(sql);
        return result.affectedRows > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get leaderboard with top scores
 * @param {number} limit - Number of top scores to return
 * @returns {Promise<Object[]>} Array of score objects with user info
 */
exports.getLeaderboard = async function(limit = 10) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT us.Score, us.QuestionsAnswered, us.DatePlayed, u.Username, u.FirstName, u.LastName
                   FROM UserScores us
                   JOIN Users u ON us.UserId = u.UserId
                   ORDER BY us.Score DESC, us.DatePlayed DESC
                   LIMIT ${limit}`;
        
        const [results] = await con.query(sql);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get a specific user's score history
 * @param {number} userId - User ID
 * @returns {Promise<Object[]>} Array of user's scores
 */
exports.getUserScores = async function(userId) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT Score, QuestionsAnswered, DatePlayed
                   FROM UserScores
                   WHERE UserId = ${userId}
                   ORDER BY DatePlayed DESC`;
        
        const [results] = await con.query(sql);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get all questions for admin viewing
 * @returns {Promise<Object[]>} Array of all question objects
 */
exports.getAllQuestions = async function() {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT QuestionId, QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3 
                   FROM Questions
                   ORDER BY QuestionId DESC`;
        
        const [results] = await con.query(sql);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Add a new question to the database
 * @param {string} questionText - The question text
 * @param {string} correctAnswer - The correct answer
 * @param {string} incorrectAnswer1 - First incorrect answer
 * @param {string} incorrectAnswer2 - Second incorrect answer
 * @param {string} incorrectAnswer3 - Third incorrect answer
 * @returns {Promise<Object>} Result object with status and message
 */
exports.addQuestion = async function(questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();
    
    try {
        let sql = `INSERT INTO Questions (QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3) 
                   VALUES (?, ?, ?, ?, ?)`;
        
        const [insertResult] = await con.query(sql, [questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3]);
        
        result.status = STATUS_CODES.success;
        result.message = 'Question added successfully';
        result.data = insertResult.insertId;
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    } finally {
        await con.end();
    }
};

/**
 * Get a single question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Question object
 */
exports.getQuestionById = async function(questionId) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT QuestionId, QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3 
                   FROM Questions
                   WHERE QuestionId = ?`;
        
        const [results] = await con.query(sql, [questionId]);
        return results[0] || null;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
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
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();
    
    try {
        let sql = `UPDATE Questions 
                   SET QuestionText = ?, CorrectAnswer = ?, IncorrectAnswer1 = ?, IncorrectAnswer2 = ?, IncorrectAnswer3 = ?
                   WHERE QuestionId = ?`;
        
        const [updateResult] = await con.query(sql, [questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, questionId]);
        
        if (updateResult.affectedRows > 0) {
            result.status = STATUS_CODES.success;
            result.message = 'Question updated successfully';
        } else {
            result.status = STATUS_CODES.failure;
            result.message = 'Question not found';
        }
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    } finally {
        await con.end();
    }
};

/**
 * Delete a question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Result object with status and message
 */
exports.deleteQuestion = async function(questionId) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();
    
    try {
        let sql = `DELETE FROM Questions WHERE QuestionId = ?`;
        
        const [deleteResult] = await con.query(sql, [questionId]);
        
        if (deleteResult.affectedRows > 0) {
            result.status = STATUS_CODES.success;
            result.message = 'Question deleted successfully';
        } else {
            result.status = STATUS_CODES.failure;
            result.message = 'Question not found';
        }
        return result;
    } catch (err) {
        console.log(err);
        result.status = STATUS_CODES.failure;
        result.message = err.message;
        return result;
    } finally {
        await con.end();
    }
};