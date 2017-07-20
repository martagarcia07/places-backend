var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 
	date: Date,
	name: String, 
	password: String, 
	hidden: Boolean,
	admin: Boolean 
}));