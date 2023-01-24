const express = require('express');
const router = new express.Router({ mergeParams: true });
const { body } = require('express-validator');
const {
    createTeam,
    getCertainTeamName,
    getCertainTeamDetail,
    getTeamMembers
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
router.get('/', getCertainTeamName);
router.post('/', [validateTeamname], createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);

module.exports = router;