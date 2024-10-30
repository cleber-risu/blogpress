const express = require('express')
const slugify = require('slugify')
const router = express.Router()

const Category = require('../categories/Category')
const Article = require('../articles/Article')

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    res.render('admin/articles/index', { articles })
  })
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll()
    .then(categories => {
      res.render('admin/articles/new', { categories })
    })
})

router.post('/articles/save', (req, res) => {
  const title = req.body.title
  const body = req.body.body
  const categoryId = req.body.category

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: categoryId
  }).then(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/delete', (req, res) => {
  const id = req.body.id
  if (id !== undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => res.redirect('/admin/articles'))
    } else {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

router.get('/admin/articles/edit/:id', (req, res) => {
  const id = req.params.id
  Article.findByPk(id).then(article => {
    if (article) {

      Category.findAll().then(categories => {
        res.render('admin/articles/edit', { article, categories })
      })

    } else {
      res.redirect('/admin/articles')
    }
  }).catch(err => {
    console.log(err);
    res.redirect('/admin/articles')
  })

})

router.post('/articles/update', (req, res) => {
  const id = req.body.id
  const title = req.body.title
  const body = req.body.body
  const category = req.body.category

  Article.update({ 
    title: title, 
    slug: slugify(title), 
    body: body,
    categoryId: category
  }, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/admin/articles')
  }).catch(err => {
    console.log(err);
    res.redirect('/')
  })
})

module.exports = router