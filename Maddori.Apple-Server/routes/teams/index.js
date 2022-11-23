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
body('team_name').not().isEmpty(),
body('team_name').isString(),
body('team_name').custom((value) => {
    const pattern = /[~!@#\#$%<>^&*]/
    if (!!pattern.test(value)) {
        console.log(pattern.test(value));
        throw new Error('특수문자가 들어갔습니다.');
    }
    return true;
}),
body('team_name').isLength({max:10}),
createTeam);

router.get('/:team_id', [userTeamCheck], getCertainTeamDetail);
router.get('/:team_id/members', [userTeamCheck], getTeamMembers);

module.exports = router;