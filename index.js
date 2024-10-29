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
const Category = require('./categories/Category')

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
  Article.findAll({
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles, categories })
    })
  })
})

app.get('/:slug',  (req, res) => {
  const slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article) {
      Category.findAll().then(categories => {
        res.render('article', { article, categories })
      })  
    } else {
      res.redirect('/')
    }
  }).catch(err => {
    console.log(err)
    res.redirect('/')
  })
})

app.get('/category/:slug', (req, res) => {
  const slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if (category) {
      Category.findAll().then(categories => {
        res.render('index', { articles: category.articles, categories })
      })
    } else {
      res.redirect('/')
    }
  }).catch(err => {
    console.log(err);
    res.redirect('/')  
  })
})

app.listen(8080, () => {
  console.log('Server started: http://localhost:8080')
})