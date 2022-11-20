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
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], createFeedback);
router.get('/', [userTeamCheck], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], updateFeedback);
router.delete("/:feedback_id", [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck], getFromMeToCertainMemberFeedbackAll);
router.get("/from-team", [userTeamCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback); 

module.exports = router;