const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createTeam,
    getCertainTeamName,
    getCertainTeamDetail,
    getTeamMembers
} = require('./teams');
const {
    userTeamCheck,
    userAdminCheck
} = require('../../middlewares/auth');

const { body } = require('express-validator');

router.get('/', getCertainTeamName);

router.post('/',
[body('team_name').isEmpty().isString().isLength({max:10})],
createTeam);

router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);

module.exports = router;