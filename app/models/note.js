var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model

module.exports = mongoose.model('Note', new Schema({ 
	pid: String,
	uid: String,
	date: Date,
	title: String,
	comment: String
}));