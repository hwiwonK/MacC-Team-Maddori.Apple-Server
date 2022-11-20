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

router.post('/login', [userCheck], userLogin);
router.post('/join-team/:team_id', [userCheck], userJoinTeam);
router.delete('/team/:team_id/leave', [userTeamCheck], userLeaveTeam);

module.exports = router;