const dbconnection = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = "HELLOKRUPALSINH"; // Consider storing secret keys securely, like environment variables

const userLogin = async (loginData) => {
    try {
        // Input validation
        if (!loginData.username || !loginData.password_hash) {
            throw new Error('Both username and password are required');
        }

        // Database query to find user
        const user = await getUserByUsername(loginData.username);

        if (!user) {
            throw new Error('User not found');
        }

        // Password comparison
        const passwordMatch = await bcrypt.compare(loginData.password_hash, user.password_hash);

        if (!passwordMatch) {
            throw new Error('Wrong password');
        }

        // JWT token generation
        const token = jwt.sign({ userId: user.id, username: user.username }, jwtSecretKey, { expiresIn: '1h' });

        await Addlastlogin(user.username);

        return {
            // if send user whole data
            // data: user,
            // message: 'Login successful',
            token
        };
    } catch (error) {
        throw error; // Propagate the error for centralized error handling
    }
};

// Function to retrieve user from database by username
const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        dbconnection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]); // Resolve with the first user found
            }
        });
    });
};

// Function to add last login date time in user by username
const Addlastlogin = (username) => {
    return new Promise((resolve, reject) => {
        const lastLogin = new Date();
        dbconnection.query('UPDATE users SET last_login = ? WHERE username = ?', [lastLogin, username], (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results)
            }
        })
    })
}


const modifyPassword = async (modifyData) => {
    try {
        if (!modifyData.username || !modifyData.password_hash || !modifyData.newpassword) {
            throw new Error('All fields are required');
        }

        // Database query to find user by username
        dbconnection.query('SELECT * FROM users WHERE username = ?', [modifyData.username], (err, results) => {
            if (err) {
                throw err;
            } else if (results.length === 0) {
                throw new Error('User not found');
            } else {
                const user = results[0];
                // Compare provided password hash with stored password hash
                bcrypt.compare(modifyData.password_hash, user.password_hash, (err, passwordMatch) => {
                    if (err) {
                        throw err;
                    } else if (!passwordMatch) {
                        throw new Error('Password does not match');
                    } else {
                        // Hash new password
                        bcrypt.hash(modifyData.newpassword, 10, (err, hashedPassword) => {
                            if (err) {
                                throw err;
                            }
                            // Update password hash in the database
                            dbconnection.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id], (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    return { message: "Password Updated Successfully" };
                                }
                            });
                        });
                    }
                });
            }
        });
    } catch (error) {
        throw error; // Propagate the error for centralized error handling
    }
};

module.exports = { userLogin, modifyPassword };