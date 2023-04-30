const sql = require('mysql');
const dotenv = require("dotenv").config();
// const pool =createPool({
//     host:'sql202.epizy.com',
//     user:'epiz_34082873',
//     password:'EUBHcmaeso',
//     database:'epiz_34082873_enquirethecalender',
//     connectionLimit:2
// })
const db = sql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
})

module.exports = db;