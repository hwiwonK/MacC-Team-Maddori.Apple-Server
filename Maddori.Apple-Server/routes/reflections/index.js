const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    getPastReflectionList,
    endInProgressReflection
} = require('./reflections');

router.get('/current', getCurrentReflectionDetail);
router.get('/', getPastReflectionList);
router.patch("/:reflection_id/end", endInProgressReflection);

module.exports = router;