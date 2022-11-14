const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    updateReflectionDetail,
    getPastReflectionList
} = require('./reflections');
const {
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

router.get('/', [userTeamCheck], getPastReflectionList);
router.get('/current', [userTeamCheck, reflectionTimeCheck], getCurrentReflectionDetail);
router.patch('/:reflection_id', [userTeamCheck, userAdminCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired')], updateReflectionDetail);

module.exports = router;