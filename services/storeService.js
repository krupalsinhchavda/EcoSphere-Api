const mysql = require('mysql');
const dbconnection = require('../config/database');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'krupalsinhchavda36143@gmail.com',
        pass: 'ssha cypc dsvr clmo'
    }
});

function storeEmail(storeData, email, results) {

    const mailOptions = {
        from: 'krupalsinhchavda36143@gmail.com',
        to: email,
        subject: 'Store Creation Confirmation',
        html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Store Creation Successful</title>
                <style>
                    /* Add some basic styling */
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    p {
                        color: #666;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }
                    .button {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: white;
                        padding: 12px 24px;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                        margin-top: 20px;
                        transition: background-color 0.3s ease;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                    .store-image {
                        display: block;
                        margin: 0 auto;
                        max-width: 100%;
                        height: auto;
                        border-radius: 5px;
                        margin-bottom: 30px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <img src="https://via.placeholder.com/400x200" alt="Store Logo" class="store-image">
                    <h1>Welcome to Your New Store!</h1>
                    <p>Congratulations! Your store has been successfully created. You're now ready to start selling.</p>
                    <p>Take the first step towards success by visiting your store and adding your products.</p>
                    <a href="${storeData.website}" class="button">Visit Your Store</a>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                </div>
            </body>
            </html>   `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            results.status(500).json({ error: 'Error sending email' });
        } else {
            console.log('Email sent successfully:', info.response);
            results.status(201).json({ message: 'Store created successfully' });
        }
    });

};

const CreateStore = async (storeData, res) => {
    const createdOn = new Date();
    try {
        return await new Promise((resolve, reject) => {
            const query = "INSERT INTO store (name, location, image_url, ownerId, contact_person, contact_number, opening_hours, category, website, established_year, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            dbconnection.query(query, [storeData.name, storeData.location, storeData.image_url, storeData.ownerId, storeData.contact_person, storeData.contact_number, storeData.opening_hours, storeData.category, storeData.website, storeData.established_year, createdOn], (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    const query = "SELECT email FROM users WHERE id = ?";
                    dbconnection.query(query, [storeData.ownerId], (error, userResult) => {
                        if (error) {
                            throw error;
                        }

                        const email = userResult.length > 0 ? userResult[0].email : '';

                        storeEmail(storeData, email, res);

                        resolve(userResult);
                    });
                    resolve(results);
                }
            })
        });
        // const user = await getUserById(storeData.ownerId);
        // const email = user ? user.email : '';

        // await storeEmail(storeData, email, res);

    } catch (error) {
        res.status(500).json({ message: 'Error creating store', error });
    }
};
// Function to fetch user details by ID from the users table
const getUserById = async (userId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT email FROM users WHERE id = ?";
        dbconnection.query(query, [userId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.length > 0 ? results[0] : null);
            }
        });
    });
};

const UpdateStore = async (storeData, id) => {
    const modified_on = new Date();
    try {
        return await new Promise((resolve, reject) => {
            const query = "UPDATE store SET "
            dbconnection.query(query, [storeData], (error, results) => {
                if (error) {
                    reject(error)
                }
                else {
                    resolve(results)
                }
            });
        })
    }
    catch (error) {
        throw new Error('Error Update Store')
    }
}

const DeleteStore = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM stores WHERE id = ?";
        dbconnection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
};

const GetStore = async (pagianation, filterParams) => {
    return new Promise((resolve, reject) => {
        const page = parseInt(pagianation.page) || 1;
        const limit = parseInt(pagianation.limit) || 10;
        const orderBy = pagianation.orderBy || 'created_on';
        const orderDirection = pagianation.orderDirection || 'DESC';
        const offset = (page - 1) * limit;

        let query = "SELECT * FROM store";
        const queryParams = [];

        const whereClauses = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (value) {
                whereClauses.push(`${key} LIKE ?`);
                queryParams.push(`%${value}%`);
            }
        }

        if (whereClauses.length > 0) {
            query += `WHERE ${whereClauses.join(' AND ')}`;
        }
        query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;
        queryParams.push(offset, limit);

        dbconnection.query(query, queryParams, (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                dbconnection.query("SELECT COUNT(*) AS total FROM store", (err, totalCountResult) => {
                    if (err) {
                        reject(err);
                    }
                    else {
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
}

const GetStoreByID = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM store WHERE id = ?";
        dbconnection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(results[0]);
            }
        });
    })
}
module.exports = {
    CreateStore,
    DeleteStore,
    GetStore,
    GetStoreByID,
    UpdateStore
}
