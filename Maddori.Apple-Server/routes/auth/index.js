const express = require('express');
const router = new express.Router({ mergeParams: true });

const {
    socialLogin
} = require('./auth');

router.post('/', socialLogin);

module.exports = router;