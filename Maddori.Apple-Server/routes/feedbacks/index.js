const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    updateFeedback,
    deleteFeedback
} = require('./feedbacks');
const {
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
} = require('../../middlewares/auth');

router.post('/', [userTeamCheck, reflectionStateCheck('Before')], createFeedback);
router.get('/', [userTeamCheck], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, reflectionStateCheck('Before')], updateFeedback);
router.delete("/:feedback_id", [userTeamCheck, reflectionStateCheck('Before')], deleteFeedback);

module.exports = router;