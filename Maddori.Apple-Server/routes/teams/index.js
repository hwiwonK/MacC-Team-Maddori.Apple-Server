const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getTeamInformation,
    getTeamMembers
} = require('./teams');

router.post('/', createTeam);
router.get('/:team_id', getTeamInformation);
router.get('/:team_id/members', getTeamMembers);

module.exports = router;