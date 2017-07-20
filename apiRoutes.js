var express = require('express');

var apiRoutes = express.Router(); 

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./app/models/user'); // get our mongoose model
var Event   = require('./app/models/event'); 
var Note   = require('./app/models/note'); 
var Picture   = require('./app/models/picture'); 
var Place   = require('./app/models/place'); 
var Visit   = require('./app/models/visit'); 
var Rate   = require('./app/models/rate'); 
require('./app/calculate/calculatePlace')
var app         = express();
// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
app.set('superSecret', config.secret); // secret variable

apiRoutes.post('/authenticate', function(req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, app.get('superSecret'), {
					expiresIn: 86400 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}		

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token ||  req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/profile', function(req, res) {
	


	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/places/:place_id', function(req, res) {
    Place.findOne({gid:req.params.place_id}, function(err, place) {
        if (err)
            res.send(err);
      	calculatePlace(place)
        .then(function(data){
      	//console.log(data);
      	res.json(data);

      	});
        

    });	
});

apiRoutes.post('/places', function(req, res) {
   	var place = new Place({ 
		gid: req.body.gid, 
		date: new Date(), 
		gname: req.body.gname,
		gtypes: req.body.gtypes
	});
	place.save(function(err) {
		if (err) throw err;
		console.log('place saved successfully');
		res.json({ success: true });
	});
});

apiRoutes.patch('/places/:place_id', function(req, res) {
   	switch (req.body.item){
   		case "rate":
		   	var rate = new Rate({ 
				pid: req.params.place_id, 
				uid: req.body.user,
				date: new Date(), 
				rate: req.body.rate
			});
			rate.save(function(err) {
				if (err) throw err;
				console.log('rate saved successfully');
				res.json({ success: true });
			});
   			break;
		case "event":
   			break;
		case "note":
   			break;
		case "picture":
   			break;
		case "visit":
   			break;
   	}



   	var place = new Place({ 
		gid: req.params.place_id, 
		date: new Date(), 
		gname: req.body.gname,
		gtypes: req.body.gtypes
	});
	place.save(function(err) {
		if (err) throw err;
		console.log('place saved successfully');
		res.json({ success: true });
	});
});

// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
// ----------------------------------------------------------
apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});
module.exports=apiRoutes;