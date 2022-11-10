const express = require('express')
const app = express()

// sequelize 연결
const { sequelize } = require('./models');

// body-parser 사용 (json 요청을 받기 위함)
app.use(express.json());

// database 연결
sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.log('데이터베이스 연결 실패');
    console.error(err);
});

// middleware module import
const {
  userTeamCheck
} = require('./middlewares/auth');

app.get('/', (req, res) => {
  res.send('Hello World! This is KeyGo server')
})

// middleware 적용
app.use('/teams/:team_id', userTeamCheck);

// 라우팅 (users, teams, reflections, feedbacks 로 분리)
app.use('/users', require('./routes/users/index'));
app.use('/teams', require('./routes/teams/index'));
app.use('/teams/:team_id/reflections', require('./routes/reflections/index'));
app.use('/teams/:team_id/reflections/:reflection_id/feedbacks', require('./routes/feedbacks/index'));

module.exports = app