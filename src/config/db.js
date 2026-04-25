const mysql = require('mysql2')
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// db.connect((err) => {
//     if(err) {
//         console.log('DB Error: ', err)
//     } else {
//         console.log("MySQL Connected")
//     }
// }) klo pke pool ini gk perrlu

module.exports = db