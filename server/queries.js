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
  const { url, nudge } = request.body
  console.log(url, nudge)

  pool.query('INSERT INTO overdubs (url, nudge) VALUES ($1, $2)', [url, nudge], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Overdub added.' })
  })
}

const updateOverdub = (request, response) => {
  const id = parseInt(request.params.id)
  const { url, nudge } = request.body

  pool.query(
    'UPDATE overdub SET (url, nudge) = ($1, $2) WHERE id = $3',
    [url, nudge, id],
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
