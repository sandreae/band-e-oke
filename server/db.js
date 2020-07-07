/*eslint no-undef: "error"*/
/*eslint-env node*/

require('dotenv').config()

const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false
  }
})

/**
 * Create Overdub Table
 */
const createOverdubTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      overdubs(
        id UUID PRIMARY KEY,
        url VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        nudge FLOAT NOT NULL,
        gain FLOAT NOT NULL,
        owner_id UUID NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create User Table
 */
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        username VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Overdub Tables
 */
const dropOverdubTable = () => {
  const queryText = 'DROP TABLE IF EXISTS overdubs returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop User Table
 */
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Create All Tables
 */
const createAllTables = () => {
  createUserTable();
  createOverdubTable();
}
/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropUserTable();
  dropOverdubTable();
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createOverdubTable,
  createUserTable,
  createAllTables,
  dropUserTable,
  dropOverdubTable,
  dropAllTables
};

require('make-runnable');
