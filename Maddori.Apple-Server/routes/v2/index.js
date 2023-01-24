const express = require('express');
const router = new express.Router({ mergeParams: true });

// 라우팅 (auth, users, teams, reflections, feedbacks 로 분리)
router.use('/users', require('./users/index'));
router.use('/teams', require('./teams/index'));

module.exports = router;