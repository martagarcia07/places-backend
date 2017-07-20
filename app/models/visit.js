var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model

module.exports = mongoose.model('Visit', new Schema({ 
	pid: String,
	uid: String,
	public: Boolean,
	date: Date
}));