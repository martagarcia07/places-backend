var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model

module.exports = mongoose.model('Place', new Schema({ 
	id: String, 
	date: Date,
	gname: String, 
	gid: String, 
	gtypes: []
}));