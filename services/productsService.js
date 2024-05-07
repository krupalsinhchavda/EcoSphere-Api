const dbconnection = require('../config/database');

const CreateProduct = async (obj) => {
    const created_on = new Date();
    return new Promise((resolve, reject) => {
        const checkquery = "SELECT * FROM store where id = ?";
        dbconnection.query(checkquery, [obj.store_id], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result.length === 0) {
                    reject(new Error('Store Not Found'))
                }
                else {
                    const sql = `INSERT INTO products (name, description, price, quantity, store_id, category, image_url, created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                    const values = [obj.name, obj.description, obj.price, obj.quantity, obj.store_id, obj.category, obj.image_url, created_on];
                    dbconnection.query(sql, values, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    })
                }
            }
        })
    })
}

const UpdateProduct = async (id, obj) => {
    const modified_on = new Date();
    return new Promise((resolve, reject) => {
        const checkquery = "SELECT * FROM store where id = ?";
        dbconnection.query(checkquery, [obj.store_id], (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result.length === 0) {
                    reject(new Error('Store Not Found'))
                }
                else {
                    const sql = `UPDATE  products SET name = ?, description = ?, price = ?, quantity = ?, store_id = ?, category = ?,is_active  = ?, modified_on = ? where id = ?`;
                    const values = [obj.name, obj.description, obj.price, obj.quantity, obj.store_id, obj.category, obj.is_active, modified_on, id];
                    dbconnection.query(sql, values, (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            resolve(result);
                        }
                    })
                }
            }
        })
    })
}

const GetAllProducts = async (pagination, filterParams) => {
    return new Promise((resolve, reject) => {
        const page = parseInt(pagination.page) || 1;
        const limit = parseInt(pagination.limit) || 10;
        const orderBy = pagination.orderBy || 'created_On';
        const orderDirection = pagination.orderDirection || 'DESC';
        const offset = (page - 1) * limit;
        let query = "SELECT * FROM products"
        // let query = `SELECT products.*,store.name AS Store_Name
        //             FROM products
        //             JOIN store ON products.store_id = store.id`;
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
        dbconnection.query(query, queryParams, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                dbconnection.query("SELECT COUNT(*) AS total FROM products", (err, totalCountResult) => {
                    if (err) {
                        reject(err)
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
                })
            }
        })
    })
}
const GetProductByid = async (id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT products.*,store.name AS Store_Name 
                    FROM products 
                    JOIN store ON products.store_id = store.id WHERE products.id = ?`;

        dbconnection.query(query, [id], (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.length === 0) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            }

        });
    });
};

const GetProductByStoreId = async (id) => {
    return new Promise((resolve, reject) => {
        const checkQuery = "SELECT * FROM store WHERE id = ?";
        dbconnection.query(checkQuery, id, (error, storeResult) => {
            if (error) {
                reject(error);
            } else {
                if (storeResult.length === 0) {
                    resolve("Store not found");
                } else {
                    const query = `SELECT products.*, store.name AS Store_Name 
                                    FROM products 
                                    JOIN store ON products.store_id = store.id 
                                    WHERE products.store_id = ?`;
                    dbconnection.query(query, id, (error, productResult) => {
                        if (error) {
                            reject(error);
                        } else {
                            if (productResult.length === 0) {
                                resolve(null);
                            } else {
                                resolve(productResult);
                            }
                        }
                    });
                }
            }
        });
    });
};


const DeleteProduct = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "DELETE FROM products WHERE id = ?";
        dbconnection.query(query, id, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.affectedRows === 0) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            }
        })
    })
}
module.exports = {
    CreateProduct,
    GetAllProducts,
    GetProductByid,
    DeleteProduct,
    UpdateProduct,
    GetProductByStoreId
}