/*eslint no-undef: "error"*/
/*eslint-env node*/

const { pool } = require('./config')

const getOverdubs = (request, response) => {
  pool.query('SELECT * FROM overdubs', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getOverdubById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM overdubs WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createOverdub = (request, response) => {
  const { url, nudge, gain } = request.body

  pool.query('INSERT INTO overdubs (url, nudge, gain) VALUES ($1, $2, $3)', [url, nudge, gain], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Overdub added.' })
  })
}

const updateOverdub = (request, response) => {
  const id = parseInt(request.params.id)
  const { url, nudge, gain } = request.body
  pool.query(
    'UPDATE overdubs SET (url, nudge, gain) = ($1, $2, $3) WHERE id = $4',
    [url, nudge, gain, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Overdub modified with ID: ${id}`)
    }
  )
}

const deleteOverdub = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM overdubs WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Overdub deleted with ID: ${id}`)
  })
}

module.exports = {
  getOverdubs,
  getOverdubById,
  createOverdub,
  updateOverdub,
  deleteOverdub,
}
