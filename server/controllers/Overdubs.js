const moment = require('moment')
const {uuid} = require('uuidv4')
const {db} = require('../query')

const Overdubs = {
  /**
   * Create A Overdub
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async create(req, res) {
    const createQuery = `INSERT INTO
      overdubs(id, url, title, nudge, gain, owner_id, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      returning *`;
    const values = [
      uuid(),
      req.body.url,
      req.body.title,
      req.body.nudge,
      req.body.gain,
      req.user.id,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get All Overdubs
   * @param {object} req
   * @param {object} res
   * @returns {object} overdubs array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM overdubs where owner_id = $1';
    try {
      const { rows } = await db.query(findAllQuery, [req.user.id]);
      return res.status(200).send(rows);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A Overdub
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM overdubs WHERE id = $1 AND owner_id = $2';
    try {
      const { rows } = await db.query(text, [req.params.id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Get All Overdubs By Titlw
   * @param {object} req
   * @param {object} res
   * @returns {object} overdubs array
   */
  async getByTitle(req, res) {
    const findAllQuery = 'SELECT * FROM overdubs where owner_id = $1 AND title = $2';
    try {
      const { rows } = await db.query(findAllQuery, [req.user.id, req.params.title]);
      return res.status(200).send(rows);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Update A Overdub
   * @param {object} req
   * @param {object} res
   * @returns {object} updated reflection
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM overdubs WHERE id=$1 AND owner_id = $2';
    const updateOneQuery =`UPDATE overdubs
      SET url=$1,title=$2,nudge=$3,gain=$4,modified_date=$5
      WHERE id=$6 AND owner_id = $7 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      const values = [
        req.body.url || rows[0].url,
        req.body.title || rows[0].title,
        req.body.nudge || rows[0].nudge,
        req.body.gain || rows[0].gain,
        moment(new Date()),
        req.params.id,
        req.user.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete A Overdub
   * @param {object} req
   * @param {object} res
   * @returns {void} return statuc code 204
   */
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM overdubs WHERE id=$1 AND owner_id = $2 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'reflection not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

module.exports = {
  Overdubs
};
