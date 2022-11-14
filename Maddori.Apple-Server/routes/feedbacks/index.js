const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    getFromMeToCertainMemberFeedbackAll,
    updateFeedback,
    deleteFeedback
} = require('./feedbacks');
const {
    userTeamCheck,
    userAdminCheck
} = require('../../middlewares/auth');

router.post('/', [userTeamCheck], createFeedback);
router.get('/', [userTeamCheck], getCertainTypeFeedbackAll);
router.put('/:feedback_id', updateFeedback);
router.delete("/:feedback_id", deleteFeedback);
router.get('/from_me', getFromMeToCertainMemberFeedbackAll);

module.exports = router;