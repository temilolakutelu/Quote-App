var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.SchemaTypes.ObjectId;

var UserSchema = new Schema({
    name: String,
    email: String,
    password: String,

}, { timestamps: { createdAt: 'created_at' } });

var UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel;