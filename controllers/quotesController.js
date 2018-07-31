var generateController = require('../utils/generateController');
var quotesModel = require('../models/quotes');

module.exports = generateController(quotesModel);