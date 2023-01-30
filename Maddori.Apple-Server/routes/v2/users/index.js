const express = require('express');
const router = new express.Router({ mergeParams: true });

// 이미지 파일 받기 위한 미들웨어 추가
const {
    uploadFile
 } = require('../../../middlewares/upload');

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
    validateUsername
} = require('../../../middlewares/validate');

// user auth 검증
router.use('/', userCheck);
// handler
router.post('/join-team/:team_id', uploadFile, userJoinTeam);
router.delete('/team/:team_id/leave', userLeaveTeam);

module.exports = router;