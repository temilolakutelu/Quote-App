var express = require('express')
var quotes = require('./quotes');
var users = require('./users');

var mainRouter = express.Router();

mainRouter.use('/quotes', quotes);
mainRouter.use('/users', users);

module.exports = mainRouter;