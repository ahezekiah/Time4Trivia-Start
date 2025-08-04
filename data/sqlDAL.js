/**
 * SECURE VERSION - SQL Data Access Layer with parameterized queries to prevent SQL injection
 */
var mysql = require("mysql2/promise");

const sqlConfig = {
    host: 'localhost',
    user: 'AFGLRT',
    password: 'w0RDp4Ss',
    database: 'Time4Trivia',
    multipleStatements: true,
};

const pool = mysql.createPool({
    host: 'localhost',
    user: 'AFGLRT',
    password: 'w0RDp4Ss',
    database: 'Time4Trivia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Secure session configuration
const crypto = require('crypto');
const secureSecret = crypto.randomBytes(64).toString('hex');

const User = require('../models/user').User;
const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

/**
 * Get all users with their roles
 * @returns array of user models
 */
exports.getAllUsers = async function () {
    const users = [];
    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users`;
        const [userResults] = await con.query(sql);

        for (let user of userResults) {
            let rolesSql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?`;
            const [roleResults] = await con.query(rolesSql, [user.UserId]);

            let roles = [];
            for (let role of roleResults) {
                roles.push(role.Role);
            }

            let u = new User(user.UserId, user.Username, user.Email, user.Password, user.FirstName, user.LastName, roles);
            users.push(u);
        }

        return users;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get all users with role information joined
 * @returns array of user models
 */
exports.getUsers = async function () {
    const users = [];
    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId`;
        const [userResults] = await con.query(sql);

        for (let user of userResults) {
            let rolesSql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?`;
            const [roleResults] = await con.query(rolesSql, [user.UserId]);

            let roles = [];
            for (let role of roleResults) {
                roles.push(role.Role);
            }

            let u = new User(user.UserId, user.Username, user.Email, user.Password, user.FirstName, user.LastName, roles);
            users.push(u);
        }

        return users;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get users by role with secure parameterized query
 * @param {string} role - The role to filter by
 * @returns array of user models
 */
exports.getUsersByRole = async function (role) {
    const users = [];
    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users u join UserRoles ur on u.userid = ur.userId join Roles r on ur.roleId = r.roleId where r.role = ?`;
        const [userResults] = await con.query(sql, [role]);

        for (let user of userResults) {
            let rolesSql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?`;
            const [roleResults] = await con.query(rolesSql, [user.UserId]);

            let roles = [];
            for (let roleResult of roleResults) {
                roles.push(roleResult.Role);
            }

            let u = new User(user.UserId, user.Username, user.Email, user.Password, user.FirstName, user.LastName, roles);
            users.push(u);
        }

        return users;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get user by ID with secure parameterized query
 * @param {number} userId - User ID
 * @returns User object or null
 */
exports.getUserById = async function (userId) {
    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select * from Users where UserId = ?`;
        const [results] = await con.query(sql, [userId]);

        if (results.length > 0) {
            let user = results[0];
            
            let rolesSql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?`;
            const [roleResults] = await con.query(rolesSql, [user.UserId]);

            let roles = [];
            for (let role of roleResults) {
                roles.push(role.Role);
            }

            return new User(user.UserId, user.Username, user.Email, user.Password, user.FirstName, user.LastName, roles);
        }

        return null;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Delete user by ID with secure parameterized query
 * @param {number} userId - User ID
 * @returns Result object
 */
exports.deleteUserById = async function (userId) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        // First delete from UserRoles table (foreign key constraint)
        let deleteRolesSql = `delete from UserRoles where UserId = ?`;
        await con.query(deleteRolesSql, [userId]);

        // Then delete from Users table
        let deleteUserSql = `delete from Users where UserId = ?`;
        const [deleteResult] = await con.query(deleteUserSql, [userId]);

        if (deleteResult.affectedRows > 0) {
            result.status = STATUS_CODES.success;
            result.message = `User ${userId} deleted!`;
        } else {
            result.status = STATUS_CODES.failure;
            result.message = `User ${userId} not found`;
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
 * Promote user to admin role with secure parameterized query
 * @param {number} userId - User ID
 * @returns Result object
 */
exports.promoteUser = async function (userId) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        // Remove existing roles
        let deleteRolesSql = `delete from UserRoles where UserId = ?`;
        await con.query(deleteRolesSql, [userId]);

        // Add admin role (RoleId 2 for admin)
        let insertRoleSql = `insert into UserRoles (UserId, RoleId) values (?, 2)`;
        await con.query(insertRoleSql, [userId]);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} promoted to admin!`;
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
 * Demote user to regular user role with secure parameterized query
 * @param {number} userId - User ID
 * @returns Result object
 */
exports.demoteUser = async function (userId) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        // Remove existing roles
        let deleteRolesSql = `delete from UserRoles where UserId = ?`;
        await con.query(deleteRolesSql, [userId]);

        // Add regular user role (RoleId 1 for user)
        let insertRoleSql = `insert into UserRoles (UserId, RoleId) values (?, 1)`;
        await con.query(insertRoleSql, [userId]);

        result.status = STATUS_CODES.success;
        result.message = `User ${userId} demoted to regular user!`;
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
 * Get user by username with secure parameterized query
 * @param {string} username - Username
 * @returns User object or null
 */
// async function getUserByUsername(username) {
//     const con = await mysql.createConnection(sqlConfig);

//     try {
//         let sql = `select * from Users where Username = ?`;
//         const [results] = await con.query(sql, [username]);

//         if (results.length > 0) {
//             let user = results[0];
            
//             let rolesSql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where ur.UserId = ?`;
//             const [roleResults] = await con.query(rolesSql, [user.UserId]);

//             let roles = [];
//             for (let role of roleResults) {
//                 roles.push(role.Role);
//             }

//             return new User(user.UserId, user.Username, user.Email, user.Password, user.FirstName, user.LastName, roles);
//         }

//         return null;
//     } catch (err) {
//         console.log(err);
//         throw err;
//     } finally {
//         await con.end();
//     }
// };

async function getUserByUsername(username) {
    const [rows] = await pool.query(
        'SELECT * FROM Users WHERE Username = ? AND Enabled = 1',
        [username]
    );
    return rows[0]; // only return first match
}



/**
 * Get user roles by user ID with secure parameterized query
 * @param {number} userId - User ID
 * @returns Array of role names
 */
exports.getUserRoles = async function (userId) {
    const con = await mysql.createConnection(sqlConfig);

    try {
        let sql = `select UserId, Role from UserRoles ur join Roles r on ur.roleid = r.roleid where UserId = ?`;
        const [results] = await con.query(sql, [userId]);

        let roles = [];
        for (let role of results) {
            roles.push(role.Role);
        }

        return roles;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get roles by user ID
 * @param {number} userId - User ID
 * @returns Array of role names
 */
exports.getRolesByUserId = async function (userId) {
    return exports.getUserRoles(userId);
};

/**
 * Register a new user with secure parameterized query
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} hashedPassword - Hashed password
 * @returns Result object
 */
exports.registerUser = async function (username, email, hashedPassword) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        let sql = `insert into Users (Username, Email, Password, FirstName, LastName) values (?, ?, ?, '', '')`;
        const [insertResult] = await con.query(sql, [username, email, hashedPassword]);

        let newUserId = insertResult.insertId;

        // Assign default user role (RoleId 1)
        let roleSql = `insert into UserRoles (UserId, RoleId) values (?, 1)`;
        await con.query(roleSql, [newUserId]);

        result.status = STATUS_CODES.success;
        result.message = 'User registered successfully';
        result.data = newUserId;
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
 * Create a new user
 * @param {string} username - Username
 * @param {string} hashedPassword - Hashed password
 * @param {string} email - Email
 * @returns Result object
 */
exports.createUser = async function (username, hashedPassword, email) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        let sql = `insert into Users (Username, Email, Password, FirstName, LastName) values (?, ?, ?, '', '')`;
        const [insertResult] = await con.query(sql, [username, email, hashedPassword]);

        let newUserId = insertResult.insertId;

        // Assign default user role (RoleId 1)
        let roleSql = `insert into UserRoles (UserId, RoleId) values (?, 1)`;
        await con.query(roleSql, [newUserId]);

        result.status = STATUS_CODES.success;
        result.message = 'Account Created with User Id: ' + newUserId;
        result.data = newUserId;
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
 * Update user password with secure parameterized query
 * @param {string} userId - User ID
 * @param {string} hashedPassword - New hashed password
 * @returns Result object
 */
exports.updateUserPassword = async function (userId, hashedPassword) {
    const con = await mysql.createConnection(sqlConfig);
    let result = new Result();

    try {
        let sql = `update Users set password = ? where userId = ?`;
        const [updateResult] = await con.query(sql, [hashedPassword, userId]);

        if (updateResult.affectedRows > 0) {
            result.status = STATUS_CODES.success;
            result.message = 'Password updated successfully';
        } else {
            result.status = STATUS_CODES.failure;
            result.message = 'User not found';
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
 * Get random trivia questions from the database with secure query
 * @param {number} count - Number of questions to return
 * @returns {Promise<Object[]>} Array of question objects
 */
exports.getRandomQuestions = async function(count = 10) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        // Use RAND() for random selection with LIMIT parameter binding
        let sql = `SELECT QuestionId, QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3 
                   FROM Questions
                   ORDER BY RAND()
                   LIMIT ?`;
        
        const [results] = await con.query(sql, [count]);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Save a user's game score to the database with secure parameterized query
 * @param {number} userId - User ID
 * @param {number} score - Score achieved
 * @param {number} questionsAnswered - Total questions answered
 * @returns {Promise<boolean>} Success status
 */
exports.saveUserScore = async function(userId, score, questionsAnswered) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `INSERT INTO UserScores (UserId, Score, QuestionsAnswered) VALUES (?, ?, ?)`;
        const [result] = await con.query(sql, [userId, score, questionsAnswered]);
        return result.affectedRows > 0;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get leaderboard (top scores) with secure parameterized query
 * @param {number} limit - Number of top scores to return
 * @returns {Promise<Object[]>} Array of score objects with user info
 */
exports.getLeaderboard = async function(limit = 10) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT us.Score, us.QuestionsAnswered, us.DatePlayed, u.Username, u.FirstName, u.LastName
                   FROM UserScores us
                   JOIN Users u ON us.UserId = u.UserId
                   ORDER BY us.Score DESC, us.DatePlayed ASC
                   LIMIT ?`;
        
        const [results] = await con.query(sql, [limit]);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get a user's score history with secure parameterized query
 * @param {number} userId - User ID
 * @returns {Promise<Object[]>} Array of user's scores
 */
exports.getUserScores = async function(userId) {
    const con = await mysql.createConnection(sqlConfig);
    
    try {
        let sql = `SELECT Score, QuestionsAnswered, DatePlayed
                   FROM UserScores
                   WHERE UserId = ?
                   ORDER BY DatePlayed DESC`;
        
        const [results] = await con.query(sql, [userId]);
        return results;
    } catch (err) {
        console.log(err);
        throw err;
    } finally {
        await con.end();
    }
};

/**
 * Get all questions for viewing with secure query
 * @returns {Promise<Object[]>} Array of question objects
 */
// exports.getAllQuestions = async function() {
//     const con = await mysql.createConnection(sqlConfig);
    
//     try {
//         let sql = `SELECT QuestionId, QuestionText, CorrectAnswer, IncorrectAnswer1, IncorrectAnswer2, IncorrectAnswer3 
//                    FROM Questions
//                    ORDER BY QuestionId`;
        
//         const [results] = await con.query(sql);
//         return results;
//     } catch (err) {
//         console.log(err);
//         throw err;
//     } finally {
//         await con.end();
//     }
// };

async function getAllQuestions() {
    try {
        const [rows] = await pool.query(`
        SELECT q.QuestionID, q.QuestionText, q.CorrectAnswer,
                u.Username, u.Role
        FROM Questions q
        JOIN Users u ON q.UserID = u.UserID
        `);

        return rows.map((row) => ({
        questionId: row.QuestionID,
        text: row.QuestionText,
        correctAnswer: row.CorrectAnswer,
        user: {
            username: row.Username,
            role: row.Role
        }
        }));
    } catch (error) {
        console.error('Error fetching questions:', error);
        return [];
    }
}


/**
 * Add a new question with secure parameterized query
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
 * Get a single question by ID with secure parameterized query
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
 * Update an existing question with secure parameterized query
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
 * Delete a question by ID with secure parameterized query
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


async function query(sql, params) {
    const connection = await mysql.createConnection(sqlConfig);
    const [results] = await connection.execute(sql, params);
    await connection.end();
    return results;
}

//DISABLE USER
/**
 * Disable a user account by ID with secure parameterized query
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result object with status and message
 */
async function disableUser(userId) {
    const connection = await mysql.createConnection(sqlConfig);
    await connection.execute('UPDATE Users SET disabled = true WHERE userId = ?', [userId]);
    await connection.end();
}

/**
 * Enable a user account by ID with secure parameterized query
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Result object with status and message
 */
async function enableUser(userId) {
    const connection = await mysql.createConnection(sqlConfig);
    await connection.execute('UPDATE Users SET disabled = false WHERE userId = ?', [userId]);
    await connection.end();
}
async function updateUserRole(userId, newRole) {
    const connection = await mysql.createConnection(sqlConfig);
    await connection.execute(`
        UPDATE UserRoles SET roleId = (
        SELECT roleId FROM Roles WHERE role = ?
        ) WHERE userId = ?
    `, [newRole, userId]);
    await connection.end();
}

    module.exports = {
    query,
    disableUser,
    enableUser,
    updateUserRole,
    getUserByUsername,
    getAllQuestions
};

exports.secureSecret = secureSecret;
