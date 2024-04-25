const pg = require("pg");

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_STRING,
});

module.exports = pool;
