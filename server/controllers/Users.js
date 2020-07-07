const moment = require('moment')
const {uuid} = require('uuidv4')
const {db} = require('../query')
const {Helper} = require('./Helper')

const Users = {
  /**
   * Create A User
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async create(req, res) {
    console.log(req.body)
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(id, username, password, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5)
      returning *`;
    const values = [
      uuid(),
      req.body.username,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);

      return res.status(201).send({
        username: req.body.username ,
        token: token
      });
    } catch(error) {
      console.log(error)
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that USERNAME already exist' })
      }
      return res.status(400).send(error);
    }
  },
  /**
   * Login
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  async login(req, res) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    const text = 'SELECT * FROM users WHERE username = $1';
    try {
      const { rows } = await db.query(text, [req.body.username]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({
        username: req.body.username ,
        token: token
      });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Delete A User
   * @param {object} req
   * @param {object} res
   * @returns {void} return status code 204
   */
  async get(req, res) {
    const getQuery = 'SELECT * FROM users WHERE id=$1';
    try {
      const { rows } = await db.query(getQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(201).send({
        username: rows[0].username ,
      });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

module.exports = {
  Users
};
