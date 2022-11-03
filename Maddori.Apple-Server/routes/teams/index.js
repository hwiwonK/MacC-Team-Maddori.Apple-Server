const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam
} = require('./teams');

router.post('/', createTeam);

module.exports = router;