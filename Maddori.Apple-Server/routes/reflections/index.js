const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getCurrentReflectionDetail,
    endInProgressReflection,
    updateReflectionDetail,
    getPastReflectionList
} = require('./reflections');
const {
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck,
    teamReflectionRelationCheck
} = require('../../middlewares/auth');

router.patch('/:reflection_id/end', [userTeamCheck, userAdminCheck, teamReflectionRelationCheck, reflectionStateCheck('Progressing')], endInProgressReflection);
router.get('/', [userTeamCheck], getPastReflectionList);
router.get('/current', [userTeamCheck, reflectionTimeCheck], getCurrentReflectionDetail);
router.patch('/:reflection_id', [userTeamCheck, userAdminCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired')], updateReflectionDetail);


module.exports = router;