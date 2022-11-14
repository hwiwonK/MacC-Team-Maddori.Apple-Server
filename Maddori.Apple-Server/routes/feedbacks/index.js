const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
} = require('./feedbacks');
const {
    userTeamCheck,
    userAdminCheck
} = require('../../middlewares/auth');

router.post('/', [userTeamCheck], createFeedback);
router.get('/', [userTeamCheck], getCertainTypeFeedbackAll);
module.exports = router;