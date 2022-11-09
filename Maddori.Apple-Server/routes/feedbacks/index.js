const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    updateFeedback,
    deleteFeedback
} = require('./feedbacks');

router.post('/', createFeedback);
router.get('/', getCertainTypeFeedbackAll);
router.put('/:feedback_id', updateFeedback);
router.delete("/:feedback_id", deleteFeedback);
module.exports = router;