const mysql = require('mysql')
const dbconnection = require('../config/database');

const getPost = async (pagianation, filterParams) => {
    return new Promise((resolve, reject) => {
        const page = parseInt(pagianation.page) || 1;
        const limit = parseInt(pagianation.limit) || 10;
        const orderBy = pagianation.orderBy || 'created_on';
        const orderDirection = pagianation.orderDirection || 'DESC';
        const offset = (page - 1) * limit;

        let query = "Select * from Posts";
        const queryParams = [];

        const whereClauses = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (value) {
                whereClauses.push(`${key} LIKE ?`);
                queryParams.push(`%${value}%`);
            }
        }

        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
        query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;
        queryParams.push(offset, limit);

        dbconnection.query(query,queryParams, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                dbconnection.query("SELECT COUNT(*) AS total FROM Posts", (err, totalCountResult) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const total = totalCountResult[0].total;
                        const totalPages = Math.ceil(total / limit);
                        resolve({
                            data: result,
                            page: page,
                            limit: limit,
                            total: total,
                            totalPages: totalPages
                        });
                    }
                });
                // resolve(result);
            }
        })
    });
}

const getPostById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "Select * from posts where id = ?";
        dbconnection.query(query, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
const deletePost = (id) => {
    return new Promise((resolve, reject) => {
        const query = "Delete from posts where id = ?";
        dbconnection.query(query, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    })
}
const createPost = (Formdata) => {
    const createdOn = new Date();
    return new Promise((resolve, reject) => {
        const query = "Insert into posts (title, content, user_id, published_date, views, likes, dislikes, created_on) values(?,?,?,?,?,?,?,?)"
        dbconnection.query(query, [Formdata.title, Formdata.content, Formdata.user_id, Formdata.published_date, Formdata.views, Formdata.likes, Formdata.dislikes, createdOn], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
const updatePost = (id, Formdata) => {
    const updatedOn = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE posts SET title = ?, content = ?, user_id = ?, published_date = ?, views = ?, likes = ?, dislikes = ?, is_active = ?, modified_on = ? WHERE id = ?";
        dbconnection.query(query, [Formdata.title, Formdata.content, Formdata.user_id, Formdata.published_date, Formdata.views, Formdata.likes, Formdata.dislikes, Formdata.is_active, updatedOn, id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    getPost,
    getPostById,
    deletePost,
    createPost,
    updatePost
}