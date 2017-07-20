var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model

module.exports = mongoose.model('Event', new Schema({ 
	pid: String,
	uid: String,
	date: Date,
	date_on: Date,
	users: [],
	title: String,
	comment: String
}));