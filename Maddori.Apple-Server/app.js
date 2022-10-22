const express = require('express')
const app = express()

// sequelize 연결
const { sequelize } = require('./models');

// database 연결
//db 연결

sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.log('데이터베이스 연결 실패');
    console.error(err);
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app