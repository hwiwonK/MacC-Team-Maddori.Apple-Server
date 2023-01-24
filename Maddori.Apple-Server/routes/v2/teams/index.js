const express = require('express');
const router = new express.Router({ mergeParams: true });

const {

} = require('./teams');
const {
    userCheck,
    userTeamCheck,
    userAdminCheck
} = require('../../../middlewares/auth');
const {
    validateTeamname
} = require('../../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler

module.exports = router;