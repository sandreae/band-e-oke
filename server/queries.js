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

const getOverdubsByTitle = (request, response) => {
  const title = request.params.title

  pool.query('SELECT * FROM overdubs WHERE title = $1', [title], (error, results) => {
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
  const { url, nudge, gain, title } = request.body

  pool.query('INSERT INTO overdubs (url, nudge, gain, title) VALUES ($1, $2, $3, $4)', [url, nudge, gain, title], error => {
    if (error) {
      throw error
    }
    response.status(201).json({ status: 'success', message: 'Overdub added.' })
  })
}

const updateOverdub = (request, response) => {
  const id = parseInt(request.params.id)
  const { url, nudge, gain, title } = request.body
  pool.query(
    'UPDATE overdubs SET (url, nudge, gain, title) = ($1, $2, $3, $4) WHERE id = $5',
    [url, nudge, gain, title, id],
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
  getOverdubsByTitle,
  createOverdub,
  updateOverdub,
  deleteOverdub,
}
