const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var QuoteSchema = new Schema({
    category: { type: Schema.ObjectId, ref: 'Category' },
    author: { type: Schema.ObjectId, ref: 'Author', required: true },
    content: { type: String, required: true }
})

QuoteSchema
    .virtual('url')
    .get(function () {
        return '/catalog/quote/' + this._id;
    });
module.exports = mongoose.model('Quote', QuoteSchema);