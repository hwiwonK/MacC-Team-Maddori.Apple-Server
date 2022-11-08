const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
} = require('./feedbacks');

router.post('/', createFeedback);
router.get('/', getCertainTypeFeedbackAll);
module.exports = router;