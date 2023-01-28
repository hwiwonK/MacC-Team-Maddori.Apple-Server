const express = require('express');
const router = new express.Router({ mergeParams: true });

const {
    userCheck,
} = require('../../../middlewares/auth');

const {
    appleLogin,
    signOut
} = require('./auth');

router.post('/', appleLogin);
router.delete('/signout', [userCheck], signOut);

module.exports = router;