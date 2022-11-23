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
    reflectionStateCheck
} = require('../../middlewares/auth');

// user auth 검증
router.use('/', userCheck);

// handler
router.post('/', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], createFeedback);
router.get('/', [userTeamCheck, reflectionStateCheck('Done')], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], updateFeedback);
router.delete("/:feedback_id", [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck], getFromMeToCertainMemberFeedbackAll);
router.get("/from-team", [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback); 

module.exports = router;