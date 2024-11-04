const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('./User')
const { where } = require('sequelize')

router.get('/admin/users', (_, res) => {
  User.findAll().then(users => {
    res.render('admin/users/index', { users })
  })
})

router.get('/admin/users/create', (_, res) => {
  res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  
  User.findOne({ 
    where: { email: email } 
  }).then(user => {
    console.log('USER: ' + user);
    
    if (user == undefined) {
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
    
      User.create({
        email,
        password: hash
      }).then(() => {
        res.json({
          email,
          hash
        })
      }).catch(err => {
        console.log("ERRO: " + err);
        res.redirect('/')
      })
    } else {
      res.redirect('/admin/users/create')
    }
  })
})

router.get('/login', (_, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate',  (req, res) => {
  const email = req.body.email
  const password = req.body.password

  User.findOne({ 
    where: {
      email: email
    }
  }).then(user => {
    if (user != undefined) {
      const correct = bcrypt.compareSync(password, user.password)
      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }

        res.redirect('/admin/articles')
      } else {
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})

module.exports = router