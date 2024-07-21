const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE,
  port: '3306',
});

module.exports = db;
