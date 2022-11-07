const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamDetail,
    getTeamMembers
} = require('./teams');

router.post('/', createTeam);
router.get('/:team_id', getCertainTeamDetail);
router.get('/:team_id/members', getTeamMembers);

module.exports = router;