'use strict';
var loglib = require('log4js');
var express = require('express');
var router = express.Router();

var logger = loglib.getLogger('routesUsers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  logger.info('Serving route /users/');

  res.send('respond with a resource');
});

module.exports = router;
