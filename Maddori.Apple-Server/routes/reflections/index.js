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
    reflectionStateCheck
} = require('../../middlewares/auth');

router.get('/', [userTeamCheck], getPastReflectionList);
router.get('/current', [userTeamCheck], getCurrentReflectionDetail);
router.patch('/:reflection_id', [userTeamCheck, userAdminCheck, reflectionStateCheck('SettingRequired')], updateReflectionDetail);

module.exports = router;