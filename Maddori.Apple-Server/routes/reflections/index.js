const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    endInProgressReflection,
    updateReflectionDetail,
    getPastReflectionList
} = require('./reflections');
const {
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

// user auth 검증
router.use('/', userCheck);
// handler
router.patch('/:reflection_id/end', [userTeamCheck, userAdminCheck, reflectionStateCheck('Progressing')], endInProgressReflection);
router.get('/', [userTeamCheck], getPastReflectionList);
router.get('/current', [userTeamCheck, reflectionTimeCheck], getCurrentReflectionDetail);
router.patch('/:reflection_id', [userTeamCheck, userAdminCheck, reflectionStateCheck('SettingRequired')], updateReflectionDetail);


module.exports = router;