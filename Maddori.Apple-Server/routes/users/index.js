const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    userLogin,
    userJoinTeam
} = require('./users');

router.post('/login', userLogin);
router.post('/join-team', userJoinTeam);

module.exports = router;