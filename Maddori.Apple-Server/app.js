const express = require('express')
const app = express()

// sequelize 연결
const { sequelize } = require('./models');

// body-parser 사용 (json 요청을 받기 위함)
app.use(express.json());

// database 연결
sequelize.sync({ force: false })
.then(() => {
    // console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    // console.log('데이터베이스 연결 실패');
    // console.error(err);
});

// 버전별 라우팅 분리
const apiVersion1 = require('./routes/v1/index');
const apiVersion2 = require('./routes/v2/index');

app.get('/', (req, res) => {
  res.send('Hello World! This is KeyGo server')
});

app.use('/api/v1', apiVersion1);
app.use('/api/v2', apiVersion2);

module.exports = app