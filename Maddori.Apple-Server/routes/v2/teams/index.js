const express = require('express');
const router = new express.Router({ mergeParams: true });

// version 1 team api (version 1 api 이용 유지)
const {
    getCertainTeamName
} = require('../../v1/teams/teams');

// version 2 team api
const {
    createTeam,
    getCertainTeamDetail
} = require('./teams');

// middlewares
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
router.get('/', getCertainTeamName);
router.post('/', [validateTeamname], createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);

module.exports = router;