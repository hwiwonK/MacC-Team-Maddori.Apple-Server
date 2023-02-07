const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 team api (version 1 api 이용 유지)
const {
    getCertainTeamName
} = require('../../v1/teams/teams');

// version 2 team api
const {
    createTeam,
    getCertainTeamDetail,
    getTeamMembers,
    editTeamName
} = require('./teams');

// middlewares
const {
    userCheck,
    userTeamCheck,
    userAdminCheck
} = require('../../../middlewares/auth');
const {
    validateTeamname,
    validateNickname
} = require('../../../middlewares/validate');
const {
    uploadFile
 } = require('../../../middlewares/upload');

// user auth 검증
router.use('/', userCheck);
// handler
router.get('/', getCertainTeamName);
router.post('/', uploadFile, [validateTeamname, validateNickname], createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);
router.patch('/:team_id/team-name', [userTeamCheck, validateTeamname], editTeamName);

module.exports = router;