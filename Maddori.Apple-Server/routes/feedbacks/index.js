const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    getFromMeToCertainMemberFeedbackAll
} = require('./feedbacks');

router.post('/', createFeedback);
router.get('/', getCertainTypeFeedbackAll);
router.get('/from_me', getFromMeToCertainMemberFeedbackAll);
module.exports = router;