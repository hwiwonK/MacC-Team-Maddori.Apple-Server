const express = require('express');
const router = new express.Router({ mergeParams: true });

const {
    appleLogin
} = require('./auth');

router.post('/', appleLogin);

module.exports = router;