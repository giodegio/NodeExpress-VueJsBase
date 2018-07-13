'use strict';
var loglib = require('log4js');
var express = require('express');
var router = express.Router();

var logger = loglib.getLogger('routesIndex');

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info('Serving route /');

  res.render('index', { title: 'Express' });
});

module.exports = router;
