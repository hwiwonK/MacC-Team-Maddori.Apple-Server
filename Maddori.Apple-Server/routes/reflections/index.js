const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getRelfectionInformation
} = require('./reflections');

router.get('/current', getRelfectionInformation);

module.exports = router;