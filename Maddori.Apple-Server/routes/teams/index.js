const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamDetail,
    getTeamMembers
} = require('./teams');
const {
    userTeamCheck
} = require('../../middlewares/auth');

// middleware
router.use('/:team_id', userTeamCheck);

// functions
router.post('/', createTeam);
router.get('/:team_id', getCertainTeamDetail);
router.get('/:team_id/members', getTeamMembers);

module.exports = router;