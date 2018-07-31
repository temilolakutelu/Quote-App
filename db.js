var mongoose = require('mongoose');

module.exports = function () {
    mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/bookstore', { useNewUrlParser: true });
}