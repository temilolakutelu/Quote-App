const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.SchemaTypes.ObjectId;

var QuoteSchema = new Schema({
    category: String,
    author: String,
    content: String,
    userId: {
        type: ObjectId,
        ref: 'Users'
    }
})

QuoteSchema
    .virtual('url')
    .get(function () {
        return '/catalog/quote/' + this._id;
    });
module.exports = mongoose.model('Quote', QuoteSchema);