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

module.exports = { userLogin };