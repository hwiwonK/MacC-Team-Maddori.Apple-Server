const express = require('express');
const router = new express.Router({ mergeParams: true });

const {
    createTeam,
    getCertainTeamDetail
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
router.post('/', [validateTeamname], createTeam);
router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);

module.exports = router;