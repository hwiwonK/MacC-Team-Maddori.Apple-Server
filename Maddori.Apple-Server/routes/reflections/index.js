const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    getPastReflectionList
} = require('./reflections');

router.get('/current', getCurrentReflectionDetail);
router.get('/', getPastReflectionList);

module.exports = router;