const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    getFromMeToCertainMemberFeedbackAll,
    updateFeedback,
    deleteFeedback,
    getTeamAndUserFeedback
} = require('./feedbacks');
const {
    userCheck,
    userTeamCheck,
    reflectionTimeCheck,
    reflectionStateCheck,
    teamReflectionRelationCheck,
    reflectionFeedbackRelationCheck
} = require('../../middlewares/auth');
const {
    validateFeedback
} = require('../../middlewares/validate');


// user auth 검증
router.use('/', userCheck);
// handler
router.post('/', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], validateFeedback, createFeedback);
router.get('/', [userTeamCheck, teamReflectionRelationCheck, reflectionStateCheck('Done')], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck, validateFeedback], updateFeedback);
router.delete('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], getFromMeToCertainMemberFeedbackAll);
router.get('/from-team', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback);

module.exports = router;