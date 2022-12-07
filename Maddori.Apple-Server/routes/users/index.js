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
const {
    validateUsername
} = require('../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/nickName', [validateUsername], userLogin);
router.post('/join-team/:team_id', userJoinTeam);
router.delete('/team/:team_id/leave', userLeaveTeam);

module.exports = router;