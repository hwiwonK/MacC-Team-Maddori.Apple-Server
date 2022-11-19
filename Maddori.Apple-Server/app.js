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

app.get('/', (req, res) => {
  res.send('Hello World! This is KeyGo server')
});

app.get('/api/vi/login', require('./routes/auth/index'));

// 라우팅 (users, teams, reflections, feedbacks 로 분리)
app.use('/api/v1/users', require('./routes/users/index'));
app.use('/api/v1/teams', require('./routes/teams/index'));
app.use('/api/v1/teams/:team_id/reflections', require('./routes/reflections/index'));
app.use('/api/v1/teams/:team_id/reflections/:reflection_id/feedbacks', require('./routes/feedbacks/index'));

module.exports = app