const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    userLogin,
    userJoinTeam,
    userLeaveTeam
} = require('./users');
const {
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

router.post('/login', userLogin);
router.post('/join-team', userJoinTeam);
router.delete('/team/:team_id/leave', [userTeamCheck], userLeaveTeam);

module.exports = router;