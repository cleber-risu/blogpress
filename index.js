const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./db/database')
const session = require('express-session')

// controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UserController')

// models
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

const app = express()

// view engine
app.set('view engine', 'ejs')

// session
app.use(session({
  secret: "PEF^Tu|G><Chs6bk)6%#5m-bE([U9NEY", // chave para decriptar as sessões
  // a sessão precisa de um cookie para funcionar
  cookie: {
    maxAge: 30000 // tempo para expirar a sessão em milisegundos
  }
}))

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
app.use('/', usersController)

app.get('/session', (req, res) => {
  req.session.ano = 2024
  req.session.email = 'cleber@acme.com'
  req.session.user = {
    username: 'user',
    email: 'email@mail.com',
    id: 10
  }

  res.send('sessão gerada')
})

app.get('/leitura', (req, res) => {
  res.json({
    username: req.session.ano,
    email: req.session.email,
    user: req.session.user,
    id: req.session.id
  })
})

app.get('/', (req, res) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 5
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