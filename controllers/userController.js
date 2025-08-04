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
// exports.login = async function (username, password) {
//     // console.log(`Logging in with username ${username}`);

//     // Get User by Username
//     let user = await sqlDAL.getUserByUsername(username);

//     if (!user) return new Result(STATUS_CODES.failure, 'Invalid Login.');

//     let passwordsMatch = await bcrypt.compare(password, user.password); // does the given password match the user's hashed password?

//     if (passwordsMatch) {
//         // console.log('Successful login for ' + username);
//         // console.log(user);

//         return new Result(STATUS_CODES.success, 'Valid Login.', user);
//     } else {
//         return new Result(STATUS_CODES.failure, 'Invalid Login.');
//     }
// }


// exports.login = async function (username, password) {
//     const userRows = await sqlDAL.query('SELECT * FROM Users WHERE username = ?', [username]);
//     if (userRows.length === 0) return { status: STATUS_CODES.notfound };

//     const user = userRows[0];
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) return { status: STATUS_CODES.unauthorized };

//     const roleRows = await sqlDAL.query(`
//         SELECT r.role FROM Roles r
//         JOIN UserRoles ur ON ur.roleId = r.roleId
//         WHERE ur.userId = ?
//     `, [user.userId]);

//     return {
//             status: STATUS_CODES.success,
//             data: {
//             userId: user.userId,
//             username: user.username,
//             role: roleRows[0]?.role || 'user',
//             disabled: user.disabled
//         }
//     };
// };

// exports.login = async function(username, password) {
//     try {
//         const [rows] = await sqlDAL.query(
//             `SELECT r.Role FROM Roles r
//             JOIN UserRoles ur ON ur.RoleId = r.RoleId
//             WHERE ur.UserId = ?`,
//             [user.UserId]
//         );


//         if (!rows || rows.length === 0) {
//         return { status: 'error', message: 'User not found or disabled' };
//         }

//         const user = rows[0];

//         const passwordMatch = await bcrypt.compare(password, user.password);
//         if (!passwordMatch) {
//         return { status: 'error', message: 'Incorrect password' };
//         }

//         // Now fetch roles if you're using roles
//         const [roleRows] = await pool.query(
//         'SELECT Role FROM UserRoles WHERE UserID = ?',
//         [user.UserID]
//         );
//         const roles = roleRows.map(r => r.Role);

//         return {
//         status: 'success',
//         data: {
//             userId: user.UserID,
//             username: user.Username,
//             roles: roles.map(r => r.Role),
//             disabled: user.Enabled === 0
//         }
//         };
//     } catch (error) {
//         console.error('Login error:', error);
//         return { status: 'error', message: 'Internal server error' };
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Step 1: Get user by username
//         const [rows] = await sqlDAL.query(
//         'SELECT * FROM Users WHERE Username = ? AND Enabled = 1',
//         [username]
//         );

//         if (rows.length === 0) {
//         return res.status(401).json({ error: 'Invalid username or account is disabled.' });
//         }

//         const user = rows[0]; // ✅ Moved declaration here to fix "access before initialization" error

//         // Step 2: Check password
//         const passwordMatch = await bcrypt.compare(password, user.Password);
//         if (!passwordMatch) {
//         return res.status(401).json({ error: 'Incorrect password.' });
//         }

//         // Step 3: Get user roles
//         const [roleRows] = await sqlDAL.query(
//         `SELECT r.Role FROM Roles r
//         JOIN UserRoles ur ON ur.RoleId = r.RoleId
//         WHERE ur.UserId = ?`,
//         [user.UserId]
//         );

//         const roles = roleRows.map(row => row.Role);

//         // Step 4: Respond with user data
//         return res.json({
//         userId: user.UserId,
//         username: user.Username,
//         roles,
//         disabled: user.Enabled === 0
//         });

//     } catch (error) {
//         console.error('Login error:', error);
//         return res.status(500).json({ error: 'Login failed.' });
//     }
// };

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required.' });
        }

        const user = await sqlDAL.getUserByUsername(username);
        if (!user) {
        return res.status(401).json({ message: 'User not found or disabled.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.Password);
        if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password.' });
        }

        // ✅ Success
        return res.status(200).json({
        message: 'Login successful',
        userId: user.UserId,
        username: user.Username
        });

    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed.' });
    }
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
