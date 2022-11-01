const express = require('express')
const app = express()
// app.router({mergeParams: true });

// sequelize 연결
const { sequelize } = require('./models');

// database 연결
sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch((err) => {
    console.log('데이터베이스 연결 실패');
    console.error(err);
});


app.get('/', (req, res) => {
  res.send('Hello World! This is KeyGo server')
})

// 라우팅 (users, teams, reflections, feedbacks 로 분리)
app.use('/users', require('./routes/users/index'));
app.use('/teams', require('./routes/teams/index'));
app.use('/teams/:team_id/reflections', require('./routes/reflections/index'));
app.use('/teams/:team_id/reflections/:reflection_id/feedbacks', require('./routes/feedbacks/index'));

module.exports = app