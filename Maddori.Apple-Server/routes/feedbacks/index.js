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
    userTeamCheck,
    userAdminCheck,
    reflectionTimeCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

const {
    validateFeedback
} = require('../../middlewares/validate');

const { checkSchema } = require('express-validator');

// 피드백 생성 API
router.post('/', 
[validateFeedback, userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], 
createFeedback);

router.get('/', [userTeamCheck], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [validateFeedback, userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], updateFeedback);
router.delete("/:feedback_id", [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck], getFromMeToCertainMemberFeedbackAll);
router.get("/from-team", [userTeamCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback); 

module.exports = router;