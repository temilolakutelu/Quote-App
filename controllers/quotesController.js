var generateController = require('../utils/generateController');
var quotesModel = require('../models/quotes');
var async = require('async');


exports.index = function (req, res, next) {
    res.send('NOT IMPLEMENTED: Site Home Page');
}

module.exports = generateController(quotesModel);