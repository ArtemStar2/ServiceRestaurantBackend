const sqlDatabase = require('./db');

const db = new sqlDatabase({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

module.exports = db