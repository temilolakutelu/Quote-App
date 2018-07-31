var express = require('express')
var quotes = require('../routes/quotes');
var users = require('../routes/users');

var mainRouter = express.Router();

mainRouter.use('/quotes', quotes);
mainRouter.use('/users', users);

module.exports = mainRouter;