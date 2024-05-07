const dbconnection = require('../config/database')

const AddOrder = async (order, res) => {
    return new Promise((resolve, reject) => {
        checkquery = "select * from users where id = ?";
        dbconnection.query(checkquery, [order.user_id], (error, result) => {
            if (error) {
                reject(error);
            }
            if (result.length === 0) {
                res.status(404).json({
                    message: "User not found"
                })
            }
            else {
                const createdOn = new Date();
                const query = "insert into orders (order_number,user_id,total_amount,order_date,delivery_date,status,shipping_address,billing_address,created_on) values (?,?,?,?,?,?,?,?,?)";
                const value = [
                    order.order_number,
                    order.user_id,
                    order.total_amount,
                    order.order_date,
                    order.delivery_date,
                    order.status,
                    order.shipping_address,
                    order.billing_address,
                    createdOn
                ]
                dbconnection.query(query, value, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                })
            }
        })
    })
}

const UpdateOrder = async (id, order, res) => {
    return new Promise((resolve, reject) => {
        checkquery = "select * from orders where id = ?";
        dbconnection.query(checkquery, [id], (error, result) => {
            if (error) {
                reject(error);
            }
            if (result.length === 0) {
                res.status(404).json({
                    message: "Order not found"
                })
            }
            else {
                const modifiedOn = new Date();
                const query = "UPDATE orders SET order_number = ?, user_id = ?, total_amount = ?, order_date = ?, delivery_date = ?, status = ?, shipping_address = ?, billing_address = ?, is_active = ?, modified_on = ? WHERE id = ?";
                const value = [
                    order.order_number,
                    order.user_id,
                    order.total_amount,
                    order.order_date,
                    order.delivery_date,
                    order.status,
                    order.shipping_address,
                    order.billing_address,
                    order.is_active,
                    modifiedOn,
                    id
                ]
                dbconnection.query(query, value, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                })
            }
        })
    })
}

const UpdateOrderStatus = (id, status) => {
    const modifiedOn = new Date();
    return new Promise((resolve, reject) => {
        const query = "UPDATE orders SET status = ?, modified_on = ? WHERE id = ?";
        const values = [status, modifiedOn, id];
        dbconnection.query(query, values, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result.affectedRows === 0) {
                    resolve(null)
                }
                else {
                    resolve(result);
                }
            }
        })
    })
}

const DeleteOrder = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "delete from orders where id = ?";
        dbconnection.query(query, id, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result.affectedRows === 0) {
                    resolve(null)
                }
                else {
                    resolve(result);
                }
            }
        })
    })
}

const GetOrdersById = async (id) => {
    return new Promise((resolve, reject) => {
        const query = "select * from orders where id = ?";
        dbconnection.query(query, id, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                if (result.length === 0) {
                    resolve(null);
                }
                else {
                    resolve(result);
                }
            }
        })
    })
}

const GetOrdersByUser = async (id) => {
    return new Promise((resolve, reject) => {
        const checkQuery = "SELECT * FROM users WHERE id = ?";

        dbconnection.query(checkQuery, id, (error, result) => {
            if (error) {
                reject(error);
            } else {
                if (result.length === 0) {
                    reject({ status: 404, message: 'User Not Found' });
                } else {
                    const query = "SELECT * FROM orders WHERE user_id = ?";

                    dbconnection.query(query, id, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                }
            }
        });
    });
};

module.exports = {
    AddOrder,
    UpdateOrder,
    UpdateOrderStatus,
    DeleteOrder,
    GetOrdersById,
    GetOrdersByUser
}