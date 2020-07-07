/*eslint no-undef: "error"*/
/*eslint-env node*/

const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const path = require('path')
const sign_s3 = require('./sign_s3')
const {Overdubs} = require('./controllers/Overdubs')
const {Users} = require('./controllers/Users')
const {Auth} = require('./middleware/Auth')
require('dotenv').config()

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

app.post('/overdubs', Auth.verifyToken, Overdubs.create);
app.get('/overdubs', Auth.verifyToken, Overdubs.getAll);
app.get('/overdubs/:id', Auth.verifyToken, Overdubs.getOne);
app.get('/overdubs/title/:title', Auth.verifyToken, Overdubs.getByTitle)
app.put('/overdubs/:id', Auth.verifyToken, Overdubs.update);
app.delete('/overdubs/:id', Auth.verifyToken, Overdubs.delete);
app.post('/users', Users.create);
app.post('/users/login',Users.login);
app.delete('/users/delete', Auth.verifyToken, Users.delete);
app.get('/users/get', Auth.verifyToken, Users.get);

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
