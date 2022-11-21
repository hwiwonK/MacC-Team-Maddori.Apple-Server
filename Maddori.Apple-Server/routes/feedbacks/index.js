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

router.post('/', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], createFeedback);
router.get('/', [userTeamCheck, reflectionStateCheck], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], updateFeedback);
router.delete("/:feedback_id", [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('Before')], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck('Done')], getFromMeToCertainMemberFeedbackAll);
router.get("/from-team", [userTeamCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback); 

module.exports = router;