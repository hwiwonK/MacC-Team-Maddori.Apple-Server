const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    updateReflectionDetail,
    getPastReflectionList
} = require('./reflections');
const {
    userAdminCheck
} = require('../../middlewares/auth');

router.get('/', getPastReflectionList);
router.get('/current', getCurrentReflectionDetail);
router.patch('/:reflection_id', [userAdminCheck], updateReflectionDetail);

module.exports = router;