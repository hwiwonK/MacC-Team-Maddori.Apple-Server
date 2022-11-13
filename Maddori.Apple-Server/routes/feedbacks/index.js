const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    updateFeedback,
    deleteFeedback,
    getTeamAndUserFeedback

} = require('./feedbacks');

router.post('/', createFeedback);
router.get('/', getCertainTypeFeedbackAll);
router.put('/:feedback_id', updateFeedback);
router.delete("/:feedback_id", deleteFeedback);
router.get("/category", getTeamAndUserFeedback); 
module.exports = router;