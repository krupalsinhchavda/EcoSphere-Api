const dbconnection = require('../config/database');

const Addfavorites = async (obj) => {
    const date = new Date();

    // Check if the user exists
    const userExistsQuery = `SELECT * FROM users WHERE id = ?`;
    const userExists = await new Promise((resolve, reject) => {
        dbconnection.query(userExistsQuery, [obj.user_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });

    // Check if the product exists
    const productExistsQuery = `SELECT * FROM products WHERE id = ?`;
    const productExists = await new Promise((resolve, reject) => {
        dbconnection.query(productExistsQuery, [obj.product_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.length > 0);
            }
        });
    });

    if (!userExists) {
        throw new Error('User not found');
    }

    if (!productExists) {
        throw new Error('Product not found');
    }

    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO favorites (user_id, product_id, added_date, created_on) VALUES (?, ?, ?, ?)`;
        dbconnetion.query(sql, [obj.user_id, obj.product_id, date, date], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};



const Deletefavorites = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM favorites WHERE id = ?`;
        dbconnection.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows === 0) {
                    reject({
                        message: "No records found for the provided ID"
                    });
                } else {
                    resolve({
                        result
                    });
                }
            }
        });
    });
};


const GetfavoritesByProduct = async (productId) => {
    return new Promise((resolve, reject) => {
        const checkquery = "SELECT * FROM products WHERE id = ?";
        dbconnection.query(checkquery, productId, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length === 0) {
                    reject(new Error("Product not found"));
                } else {
                    const sql = "SELECT * FROM favorites WHERE product_id = ?";
                    dbconnection.query(sql, productId, (error, favorites) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(favorites);
                        }
                    });
                }
            }
        });
    });
};


const GetfavoritesByUser = async (userId) => {
    return new Promise((resolve, reject) => {
        const checkquery = "SELECT * FROM users WHERE id = ?";
        dbconnection.query(checkquery, userId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.length === 0) {
                    reject(new Error("User not found"));
                } else {
                    const sql = "SELECT * FROM favorites WHERE user_id = ?";
                    dbconnection.query(sql, userId, (error, favorites) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(favorites);
                        }
                    });
                }
            }
        });
    });
};

module.exports = {
    Addfavorites,
    Deletefavorites,
    GetfavoritesByProduct,
    GetfavoritesByUser
}