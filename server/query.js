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

const db = {
  /**
   * DB Query
   * @param {string} text
   * @param {Array} params
   * @returns {object} object
   */
   query(text, params){
     return new Promise((resolve, reject) => {
       pool.query(text, params)
       .then((res) => {
         resolve(res);
       })
       .catch((err) => {
         reject(err);
       })
     })
   }
}

module.exports = {
  db
};
