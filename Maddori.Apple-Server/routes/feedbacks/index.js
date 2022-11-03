const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback
} = require('./feedbacks');

router.post('/', createFeedback);

module.exports = router;