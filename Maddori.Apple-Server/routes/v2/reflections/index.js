const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    updateReflectionDetail,
    endInProgressReflection
} = require('./reflections');
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
router.patch('/:reflection_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), validateReflectionname], updateReflectionDetail);

module.exports = router;