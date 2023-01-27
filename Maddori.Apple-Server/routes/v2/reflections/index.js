const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 reflections api (version 1 api 이용 유지)
const {
    getCurrentReflectionDetail,
    getPastReflectionList
} = require('../../v1/reflections/reflections');

// version 2 reflections api
const {
    updateReflectionDetail,
    endInProgressReflection
} = require('./reflections');

// middlewares
const {
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck,
    teamReflectionRelationCheck
} = require('../../../middlewares/auth');
const {
    validateReflectionname
} = require('../../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler
router.patch('/:reflection_id/end', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('Progressing')], endInProgressReflection);
router.get('/', [userTeamCheck], getPastReflectionList);
router.get('/current', [userTeamCheck, reflectionTimeCheck], getCurrentReflectionDetail);
router.patch('/:reflection_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), validateReflectionname], updateReflectionDetail);

module.exports = router;