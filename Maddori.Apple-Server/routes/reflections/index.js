const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail
} = require('./reflections');

router.get('/current', getCurrentReflectionDetail);

module.exports = router;