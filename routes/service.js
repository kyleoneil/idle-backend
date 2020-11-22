const router = require('express').Router();
const dateUtil = require('./../utils/dateUtil');
const userService = require('./../services/service.service');
const errorHandler = require('./errorHandler');

router.post("/queue", (req, res) => {

    const body = req.body;

});