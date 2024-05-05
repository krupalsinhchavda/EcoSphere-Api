const dbconnection = require('../config/database');

const CreateComment = async (obj) => {
    const created_on = new Date().toISOString(); // Format the date to ISO string
    return new Promise((resolve, reject) => {
        const query = "Insert into comments (content,user_id, post_id,comment_date, parent_comment_id, likes,dislikes,created_on) values (?,?,?,?,?,?,?,?)";
        dbconnection.query(query, [
            obj.content,
            obj.user_id,
            obj.post_id,
            obj.comment_date,
            obj.parent_comment_id,
            obj.likes,
            obj.dislikes,
            created_on
        ], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}
const UpdateComment = async (id, obj) => {
    const modifiedOn = new Date();
    return new Promise((resolve, reject) => {
        const query = "Update comments set content = ?,user_id = ?, post_id = ?,comment_date = ?, parent_comment_id = ?, likes = ?,dislikes = ?,is_active = ? , modified_on = ? WHERE id = ?";
        dbconnection.query(query, [
            obj.content,
            obj.user_id,
            obj.post_id,
            obj.comment_date,
            obj.parent_comment_id,
            obj.likes,
            obj.dislikes,
            obj.is_active,
            modifiedOn,
            id
        ], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        })
    })
}
const DeleteComment = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM comments WHERE id = ?";
        dbconnection.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.affectedRows === 0) {
                    reject(new Error("Comment not found"));
                } else {
                    resolve(result);
                }
            }
        });
    });
};

const GetCommentByPostId = async (id) => {
    return new Promise((resolve, reject) => {
        const postQuery = "SELECT * FROM posts WHERE id = ?";
        dbconnection.query(postQuery, [id], (postErr, postResult) => {
            if (postErr) {
                reject(postErr);
            } else if (postResult.length === 0) {
                reject(new Error("No record found for post ID"));
            } else {
                const commentQuery = `SELECT comments.*, posts.title AS post_title 
                                      FROM comments
                                      JOIN posts ON comments.post_id = posts.id
                                      WHERE comments.post_id = ?`;
                dbconnection.query(commentQuery, [id], (commentErr, commentResult) => {
                    if (commentErr) {
                        reject(commentErr);
                    } else {
                        resolve(commentResult);
                    }
                });
            }
        });
    });
};

const GetAllComments = (pagination, filterParams) => {
    return new Promise((resolve, reject) => {
        const page = parseInt(pagination.page) || 1;
        const limit = parseInt(pagination.limit) || 10;
        const orderBy = pagination.orderBy || 'created_on';
        const orderDirection = pagination.orderDirection || 'desc';
        const offset = (page - 1) * limit;

        let query = "select * from comments";
        const queryParams = [];

        const whereClauses = [];
        for (const [key, value] of Object.entries(filterParams)) {
            if (value) { // Check if the value is not empty
                whereClauses.push(`${key} LIKE ?`);
                queryParams.push(`%${value}%`);
            }
        }
        if (whereClauses.length > 0) {
            query += " where " + whereClauses.join(" and ");
        }
        query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;
        queryParams.push(offset, limit);

        dbconnection.query(query, queryParams, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                dbconnection.query("SELECT COUNT(*) AS total FROM comments", (err, totalCountResult) => {
                    if (err) {
                        reject(err);
                    } else {
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
    })
}
module.exports = {
    CreateComment,
    GetAllComments,
    GetCommentByPostId,
    UpdateComment,
    DeleteComment
}