const mysql = require('mysql');
const dbconnection = require('../config/database');

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users";
        dbconnection.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const CreateUser = () => {
    return new Promise((resolve, reject)=>{})
}
module.exports = {
    getAllUsers
};
