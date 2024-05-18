
const dbconnection = require('../config/database');

const Addreviews = async (obj) => {
    const date = new Date();
    return new Promise((resolve, reject) => {
        const sql = `Insert into reviews (product_id,user_id,rating,comment,review_date,created_on) 
                    values (?,?,?,?,?,?)`;
        dbconnection.query(sql, [
            obj.product_id,
            obj.user_id,
            obj.rating,
            obj.comment,
            date,
            date
        ], (error, result) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}

const GetReviewsById = async (id) => {
    return new Promise((resolve, reject) => {
        const sql = "select * from reviews where id = ?";
        dbconnection.query(sql, [id], (error, result) => {
            if (error) {
                reject(error)
            }
            else {
                if (result.length === 0) {
                    resolve(null);
                } else {
                    resolve(result);
                }
            }
        })
    })
}

const GetReviewsByUser = async(userId)=>{
    return new Promise((resolve,reject)=>{
        const sql = "select * from reviews where user_id = ?";
        dbconnection.query(sql,[userId],(error,result)=>{
            if(error){
                reject(error)
            }
            else{
                if(result.length === 0){
                    resolve(null)
                }
                else{
                    resolve(result)
                }
            }
        })
    })
}

const GetReviewsByProduct = async(productId)=>{
    return new Promise((resolve,reject)=>{
        const sql = "select * from reviews where user_id = ?";
        dbconnection.query(sql,[productId],(error,result)=>{
            if(error){
                reject(error)
            }
            else{
                if(result.length === 0){
                    resolve(null)
                }
                else{
                    resolve(result)
                }
            }
        })
    })
}
module.exports = {
    Addreviews,
    GetReviewsById,
    GetReviewsByUser,
    GetReviewsByProduct
}