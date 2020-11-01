const express = require('express');
const router = express.Router();
const logger = require('./../utils/logger');

/* GET home page. */
router.get('/', function (req, res, next) {
  logger.info("Rendering index.");
  res.render('index', {title: 'Express'});
});

module.exports = router;
