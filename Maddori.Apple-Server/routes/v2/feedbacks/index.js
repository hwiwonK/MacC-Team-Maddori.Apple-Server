const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 feedbacks api (version 1 api 이용 유지)
const {
    createFeedback,
    deleteFeedback
} = require('../../v1/feedbacks/feedbacks');

// version 2 feedbacks api
const {
    getCertainTypeFeedbackAll,
    updateFeedback,
    getTeamAndUserFeedback
} = require('./feedbacks');

// middlewares
const {
    userCheck,
    userTeamCheck,
    reflectionTimeCheck,
    reflectionStateCheck,
    teamReflectionRelationCheck,
    reflectionFeedbackRelationCheck
} = require('../../../middlewares/auth');
const {
    validateFeedback
} = require('../../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], validateFeedback, createFeedback);
router.delete('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck], deleteFeedback);
router.get('/', [userTeamCheck, teamReflectionRelationCheck, reflectionStateCheck('Done')], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck, validateFeedback], updateFeedback);
// router.get('/from-me', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before', 'Progressing')], getFromMeToCertainMemberFeedbackAll);
router.get('/from-team', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('Progressing', 'Done')], getTeamAndUserFeedback);

module.exports = router;