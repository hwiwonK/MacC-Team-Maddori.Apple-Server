const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll
} = require('./feedbacks');

router.post('/', createFeedback);
router.get('/', getCertainTypeFeedbackAll);

//* 특정 타입의 피드백 모두 가져오기
//router.get("/:team_id/reflection/recent/feedbacks", getCertainTypeRecentFeedbackAll);
module.exports = router;