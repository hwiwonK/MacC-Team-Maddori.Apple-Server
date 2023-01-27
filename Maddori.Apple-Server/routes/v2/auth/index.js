const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 auth api (version 1 api 이용 유지)
const {
    signOut
} = require('../../v1/auth/auth');

// version 2 auth api

// middlewares
const {
    userCheck,
} = require('../../../middlewares/auth');

// handler
router.delete('/signOut', [userCheck], signOut);

module.exports = router;