const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 feedbacks api (version 1 api 이용 유지)
const {
    createFeedback,
    deleteFeedback
} = require('../../v1/feedbacks/feedbacks');

// version 2 feedbacks api

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

module.exports = router;