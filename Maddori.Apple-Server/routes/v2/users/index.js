const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 users api (version 1 api 이용 유지)
const {
    userLeaveTeam
} = require('../../v1/users/users');

// version 2 users api
const {
    userJoinTeam
} = require('./users');

// middlewares
const {
    userCheck,
    userTeamCheck,
    userAdminCheck,
    reflectionStateCheck
} = require('../../../middlewares/auth');
const {
    validateNickname
} = require('../../../middlewares/validate');
const {
    uploadFile
 } = require('../../../middlewares/upload');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/join-team/:team_id', uploadFile, [validateNickname], userJoinTeam);
router.delete('/team/:team_id/leave', userLeaveTeam);

module.exports = router;