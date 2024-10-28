const Sequelize = require('sequelize')
const connection = require('../db/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

// tem  muitos ... 1 para N
Category.hasMany(Article)

// pertence ha ... 1 para 1
Article.belongsTo(Category)

module.exports = Article