const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamDetail,
    getTeamMembers
} = require('./teams');
const {
    userTeamCheck,
    userAdminCheck
} = require('../../middlewares/auth');

router.post('/', createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);

module.exports = router;