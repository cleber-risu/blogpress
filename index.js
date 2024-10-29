const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./db/database')

// importamos o controller
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

const article = require('./articles/Article')
const category = require('./categories/Category')
const Article = require('./articles/Article')

// view engine
app.set('view engine', 'ejs')

// static
app.use(express.static('public'))

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// database
connection
  .authenticate()
  .then(() => {
    console.log('Conexão do banco de dados feita com sucesso!')
  })
  .catch((error) => {
    console.log(error);
  })

// dizemos que queremos usar as rotas em categoriesController
// podemos colocar um prefixo
app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
  Article.findAll().then(articles => {
    res.render('index', { articles })
  })
})

app.listen(8080, () => {
  console.log('Server started: http://localhost:8080')
})