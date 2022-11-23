const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamName,
    getCertainTeamDetail,
    getTeamMembers
} = require('./teams');
const {
    userCheck,
    userTeamCheck,
    userAdminCheck
} = require('../../middlewares/auth');

// user auth 검증
router.use('/', userCheck);
// handler
router.get('/', getCertainTeamName);
router.post('/', createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);

module.exports = router;