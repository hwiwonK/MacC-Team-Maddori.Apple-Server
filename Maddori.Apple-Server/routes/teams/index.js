const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamInformation,
    getTeamMembers
} = require('./teams');

router.post('/', createTeam);
router.get('/:team_id', getCertainTeamInformation);
router.get('/:team_id/members', getTeamMembers);

module.exports = router;