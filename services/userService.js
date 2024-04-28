const mysql = require('mysql');
const dbconnection = require('../config/database');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


// WELCOME EMAIL TO USER
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'krupalsinhchavda36143@gmail.com',
        pass: 'ssha cypc dsvr clmo'
    }
});
function welcomeEmail(username, email, results) {
    const mailOptions = {
        from: 'krupalsinhchavda36143@gmail.com',
        to: email,
        subject: 'Welcome Email',
        html: `  
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .header h1 {
                    color: #333;
                }
                .content {
                    margin-bottom: 30px;
                }
                .content p {
                    color: #555;
                    line-height: 1.6;
                }
                span{
                    font-weight: 600;
                }
                .footer {
                    text-align: center;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our EcoSphere!</h1>
                </div>
                <div class="content">
                    <p>Hello <span> ${username}</span>,</p>
                    <p>Thank you for joining our platform! We are excited to have you on board.</p>
                    <p>Here are a few things you can do:</p>
                    <ul>
                        <li>Explore our features</li>
                        <li>Connect with other users</li>
                        <li>Get started on your journey</li>
                    </ul>
                    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p>Best regards,<br> The Team</p>
                </div>
                <div class="footer">
                    <p>This email was sent to you as a part of our service. 
                    If you believe you received this email by mistake, please ignore it.</p>
                </div>
            </div>
        </body>
        </html>  `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            results.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent successfully:', info.response);
            results.status(201).json({ message: 'User added successfully and welcome email sent' });
        }
    });
}

const createUser = async (userData, res) => {
    const createdOn = new Date();
    try {
        return await new Promise((resolve, reject) => {
            bcrypt.hash(userData.password_hash, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Error hasing password", err);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }
                const query = "INSERT INTO users (username, email, password_hash, bio, age, gender, registration_date, created_on, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                dbconnection.query(query, [userData.username, userData.email, hashedPassword, userData.bio, userData.age, userData.gender, userData.registration_date, createdOn, true], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        welcomeEmail(userData.username, userData.email, res);
                        resolve(results);
                    }
                });
            });
        });
    } catch (error_1) {
        console.error('Error creating user:', error_1);
        if (res) res.status(500).json({ error: 'Error creating user' });
    }
};

const updateUser = async (id, userData) => {
    const modified_on = new Date().toISOString();
    try {
        return await new Promise((resolve, reject) => {
            bcrypt.hash(userData.password_hash, 10, (err, hashedPassword) => {
                if (err) {
                    console.error("Error hashing password", err);
                    reject("Error hashing password");
                    return;
                }
                const query = "UPDATE users SET username = ?, email = ?, password_hash = ?, bio = ?, age = ?, gender = ?, registration_date = ?, modified_on = ? WHERE id = ?";
                dbconnection.query(query, [userData.username, userData.email, hashedPassword, userData.bio, userData.age, userData.gender, userData.registration_date, modified_on, id], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    }
};

const DeleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const query = "delete * from users where id = ?";

        dbconnection.query(query, id, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// const getAllUsers = () => {
//     return new Promise((resolve, reject) => {
//         const query = "SELECT * FROM users";
//         dbconnection.query(query, (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// };
const getAllUsers = (pagination, filterParams) => {
    return new Promise((resolve, reject) => {
        const page = parseInt(pagination.page) || 1;
        const limit = parseInt(pagination.limit) || 10;
        const orderBy = pagination.orderBy || 'created_on';
        const orderDirection = pagination.orderDirection || 'desc';

        const offset = (page - 1) * limit;
        let query = "SELECT * FROM users";
        const queryParams = [];

        const whereClauses = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (value) { // Check if the value is not empty
                whereClauses.push(`${key} LIKE ?`);
                queryParams.push(`%${value}%`);
            }
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;
        queryParams.push(offset, limit);

        dbconnection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            } else {
                dbconnection.query("SELECT COUNT(*) AS total FROM users", (err, totalCountResult) => {
                    if (err) {
                        reject(err);
                    } else {
                        const total = totalCountResult[0].total;
                        const totalPages = Math.ceil(total / limit);
                        resolve({
                            data: results,
                            page: page,
                            limit: limit,
                            total: total,
                            totalPages: totalPages
                        });
                    }
                });
            }
        });
    });
};

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "select * from users where id = ?";

        dbconnection.query(query, id, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    });
};

module.exports = {
    getAllUsers, getUserById, createUser, DeleteUser, updateUser
};
