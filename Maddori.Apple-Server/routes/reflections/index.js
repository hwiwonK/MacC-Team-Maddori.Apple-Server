const express = require('express');
const router = new express.Router({ mergeParams: true });
const {
    getReflectionInformation,
    getPastReflectionList
} = require('./reflections');

router.get('/current', getReflectionInformation);
router.get("/", getPastReflectionList);


module.exports = router;