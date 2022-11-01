const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    userLogin,
} = require('./users');

router.post('/login', userLogin);

module.exports = router;