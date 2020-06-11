/*eslint no-undef: "error"*/
/*eslint-env node*/

const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const sign_s3 = require('./sign_s3')
const db = require('./queries')
const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

if(!isProduction) {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const config = require('../webpack.config.dev.js');
  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));
}

app.use('/sign_s3', sign_s3.sign_s3)

app.get('/overdubs', db.getOverdubs)
app.get('/overdubs/:id', db.getOverdubById)
app.get('/overdubs/title/:title', db.getOverdubsByTitle)
app.post('/overdubs', db.createOverdub)
app.put('/overdubs/:id', db.updateOverdub)
app.delete('/overdubs/:id', db.deleteOverdub)


if (isProduction) {
  app.use(express.static(path.join(__dirname, '../build')))
  app.get('/*', function (req, res) {
   res.sendFile(path.join(__dirname, '../build', 'index.html'));
 });
}

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})
