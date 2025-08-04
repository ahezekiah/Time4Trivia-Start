const bcrypt = require('bcrypt')
const sqlDAL = require('../data/sqlDAL');

const Result = require('../models/result').Result;
const STATUS_CODES = require('../models/statusCodes').STATUS_CODES;

/**
 * 
 * @returns an array of user models
 */
exports.getUsers = async function () {
    let results = await sqlDAL.getUsers();
     console.log('getUsers');
     console.log(results);
    return results;
}

/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns a Result with status/message and the new user id as data
 */
exports.createUser = async function (username, email, password) {
    let hashedPassword = await bcrypt.hash(password, 10);

    let result = await sqlDAL.createUser(username, hashedPassword, email);

    return result;
}

/**
 * 
 * @param {*} userId 
 * @param {*} currentPassword 
 * @param {*} newPassword 
 * @param {*} confirmNewPassword 
 * @returns The result of the update with status/message
 */
exports.updateUserPassword = async function (userId, currentPassword, newPassword, confirmNewPassword) {
    // If new passwords don't match
    if (newPassword != confirmNewPassword) {
        return { status: 'Failure', message: 'Entered passwords do not match' }
    }

    let hashedNewPassword = await bcrypt.hash(newPassword, 10);

    let user = await sqlDAL.getUserById(userId);
    // console.log(user);

    // If we couldn't find the user
    if (!user) {
        return new Result(STATUS_CODES.failure, message = 'User not found.');
    }

    // Make sure the actual password matches the one the user gave us
    let passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) {
        return new Result(STATUS_CODES.failure, 'Current password is invalid');
    }

    return await sqlDAL.updateUserPassword(userId, hashedNewPassword);
}

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns The result of the login attempt
 */


exports.login = async function (username, password) {
    if (!username || !password) {
        return { status: STATUS_CODES.failure, message: 'Username and password required.' };
    }

    const user = await sqlDAL.getUserByUsername(username);
    if (!user) {
        return { status: STATUS_CODES.failure, message: 'User not found or disabled.' };
    }

    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
        return { status: STATUS_CODES.failure, message: 'Incorrect password.' };
    }

    return {
        status: STATUS_CODES.success,
        data: {
            userId: user.UserID,
            username: user.Username,
            roles: [user.Role]
        }
    };
};


/**
 * 
 * @param {*} userId 
 * @returns the matching user model or null
 */
exports.getUserById = function (userId) {
    return sqlDAL.getUserById(userId);
}

/**
 * 
 * @param {*} userId 
 * @returns deletes the user matching the userId
 */
exports.deleteUserById = function (userId) {
    return sqlDAL.deleteUserById(userId);
}

/**
 * 
 * @param {*} userId 
 * @returns promotes the user matching the userId
 */
exports.promoteUser = async function (userId) {
    return sqlDAL.promoteUser(userId, 'admin');
}

/**
 * 
 * @param {*} userId 
 * @returns promotes the user matching the userId
 */
exports.demoteUser = async function (userId) {
    return sqlDAL.demoteUser(userId, 'user');
}

/**
 * 
 * @param {*} userId 
 * @returns disables the user matching the userId
 */
exports.disableUser = async function (userId) {
    return sqlDAL.disableUser(userId);
}
/**
 * 
 * @param {*} userId 
 * @returns enables the user matching the userId
 */
exports.enableUser = async function (userId) {
    return sqlDAL.enableUser(userId);
}

module.exports = {
    getUsers: exports.getUsers,
    createUser: exports.createUser,
    updateUserPassword: exports.updateUserPassword,
    login: exports.login,
    getUserById: exports.getUserById,   
    deleteUserById: exports.deleteUserById,
    promoteUser: exports.promoteUser,
    demoteUser: exports.demoteUser,
    disableUser: exports.disableUser,
    enableUser: exports.enableUser
};