const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    userLogin,
    userJoinTeam,
    userLeaveTeam
} = require('./users');
const {
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/login', userLogin);
router.post('/join-team/:team_id', userJoinTeam);
router.delete('/team/:team_id/leave', userLeaveTeam);

module.exports = router;