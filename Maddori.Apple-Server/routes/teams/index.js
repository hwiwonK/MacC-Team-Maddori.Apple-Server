const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getTeamInformation
} = require('./teams');

router.post('/', createTeam);
router.get('/:team_id', getTeamInformation);

module.exports = router;