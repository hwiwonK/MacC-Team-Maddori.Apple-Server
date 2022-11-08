const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    updateReflectionDetail,
    getPastReflectionList
} = require('./reflections');

router.get('/', getPastReflectionList);
router.get('/current', getCurrentReflectionDetail);
router.patch('/:reflection_id', updateReflectionDetail);

module.exports = router;