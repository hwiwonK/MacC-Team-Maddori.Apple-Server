const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    createFeedback,
    getCertainTypeFeedbackAll,
    getFromMeToCertainMemberFeedbackAll,
    updateFeedback,
    deleteFeedback,
    getTeamAndUserFeedback

} = require('./feedbacks');
const {
    userTeamCheck,
    reflectionTimeCheck,
    reflectionStateCheck,
    teamReflectionRelationCheck,
    reflectionFeedbackRelationCheck
} = require('../../middlewares/auth');

router.post('/', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], createFeedback);
router.get('/', [userTeamCheck, teamReflectionRelationCheck, reflectionStateCheck('Done')], getCertainTypeFeedbackAll);
router.put('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck], updateFeedback);
router.delete('/:feedback_id', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before'), reflectionFeedbackRelationCheck], deleteFeedback);
router.get('/from-me', [userTeamCheck, reflectionTimeCheck, reflectionStateCheck('SettingRequired', 'Before')], getFromMeToCertainMemberFeedbackAll);
router.get('/from-team', [userTeamCheck, teamReflectionRelationCheck, reflectionTimeCheck, reflectionStateCheck('Progressing')], getTeamAndUserFeedback); 

module.exports = router;