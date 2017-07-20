var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model

module.exports = mongoose.model('Picture', new Schema({ 
	pid: String,
	uid: String,
	date: Date,
	title: String,
    img: { data: Buffer, contentType: String }

}));