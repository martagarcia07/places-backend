var User   	= require('../models/user'); // get our mongoose model
var Event   = require('../models/event'); 
var Note   	= require('../models/note'); 
var Picture = require('../models/picture'); 
var Visit   = require('../models/visit'); 
var Rate   	= require('../models/rate'); 

var PythonShell = require('python-shell');

function doScript(newPlace,options){
    return new Promise(function(resolve, reject) {

        PythonShell.run('rateCalculation.py', options ,function (err,results) {
            //console.log('results: %j', results);
            if(err){
                reject(err);
                return;
            }
            newPlace.rate=results[0];
            resolve(newPlace);
        
       })
    })
}
function resolveEvent(place){
    return new Promise(function(resolve, reject){
        var event = Event.find({pid:place.gid,date_on:{$gte:new Date()}}).sort({date_on:1}).limit(10)
        .then(function(data){
            place['events']= data;
            resolve(place);
        });
    });
}
function resolveNote(place){
    return new Promise(function(resolve, reject){
        var note=Note.find({pid:place._id}).sort({date:-1}).limit(10)
        .then(function(data){
            place['notes']= data;
            resolve(place);
        });       
    });
}

function resolvePicture(place){
    return new Promise(function(resolve, reject){
        var picture=Picture.find({pid:place._id}).sort({date:-1}).limit(10)
        .then(function(data){
            place['pictures']= data;
            resolve(place);
        });          
    });
}
function resolveVisit(place){
    return new Promise(function(resolve, reject){
        var visit=Visit.find({pid:place._id,public:true}).sort({date:-1}).limit(10)
        .then(function(data){
            place['visits']= data;
            resolve(place);
        });        
    });
}

calculatePlace = (place)=>{

    let newPlace=JSON.parse(JSON.stringify(place));

    var options = {
	  	scriptPath: './app/calculate/scripts',
	  	args: [place.gid]
	};
    return new Promise(function(resolve,reject){

        var pl = doScript(newPlace,options)
        .then(function(newPlace){
            return resolveEvent(newPlace);            
        }, function(err){
            console.log("unexpected error");
        })
        .then(function(newPlace){
            return resolveNote(newPlace);            
        }, function(err){
            console.log("unexpected error");
        })
        .then(function(newPlace){
            return resolvePicture(newPlace);            
        }, function(err){
            console.log("unexpected error");
        })
        .then(function(newPlace){
            return resolveVisit(newPlace);            
        }, function(err){
            console.log("unexpected error");
        })
        .then(function(newPlace){
            return newPlace;            
        }, function(err){
            console.log("unexpected error");
        });
        resolve(pl);
    })
}


module.exports = {
	calculatePlace:calculatePlace
}