
require('dotenv').config();
const mysql = require('mysql');
const dbconnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
dbconnection.connect(function(err){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("Connected to database!");
    }
});

module.exports = dbconnection;