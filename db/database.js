const Sequelize = require('sequelize')

const connection = new Sequelize('blogpress', 'root', 'admin123', {
  host: '172.17.0.2',
  dialect: 'mysql',
  timezone: '-03:00'
})

module.exports = connection