const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    updateReflectionDetail
} = require('./reflections');

router.get('/current', getCurrentReflectionDetail);
router.patch('/:reflection_id', updateReflectionDetail);

module.exports = router;