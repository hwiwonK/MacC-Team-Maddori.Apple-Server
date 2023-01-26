const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    userJoinTeam
} = require('./users');
const {
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
} = require('../../../middlewares/auth');
const {
    validateUsername
} = require('../../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/join-team/:team_id', userJoinTeam);

module.exports = router;