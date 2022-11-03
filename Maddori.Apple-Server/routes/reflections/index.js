const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getReflectionInformation
} = require('./reflections');

router.get('/current', getReflectionInformation);

module.exports = router;