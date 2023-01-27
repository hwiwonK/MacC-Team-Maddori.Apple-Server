const express = require('express');
const router = new express.Router({ mergeParams: true });

// 라우팅 (auth, users, teams, reflections, feedbacks 로 분리)
router.use('/auth', require('./auth/index'));
router.use('/users', require('./users/index'));
router.use('/teams', require('./teams/index'));
router.use('/teams/:team_id/reflections', require('./reflections/index'));

module.exports = router;