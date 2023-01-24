const express = require('express');
const router = new express.Router({ mergeParams: true });

router.use('/users', require('./users/index'));

module.exports = router;