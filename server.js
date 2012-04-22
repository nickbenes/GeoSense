var application_root = __dirname,
  	express = require("express"),
  	path = require("path"),
  	mongoose = require('mongoose'),
  	twitter = require('ntwitter'),
	nowjs = require("now"),
	csv = require('csv'),    
	date = require('datejs');

var app = express.createServer();

mongoose.connect('mongodb://localhost/geo');

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
 	app.use(express.bodyParser());
	app.use(express.methodOverride());
  	app.use(app.router);
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  	app.set('views', path.join(application_root, "views"));
});

////////////////
// CHAT SERVER
////////////////
var everyone = nowjs.initialize(app);

// Send message to everyone on the users group
everyone.now.distributeMessage = function(message){
    var group = nowjs.getGroup(this.now.serverRoom);
    group.now.receiveMessage(this.now.name, message);
};

everyone.now.joinRoom = function(newRoom){
    var newGroup = nowjs.getGroup(newRoom);
    newGroup.addUser(this.user.clientId);
    //newGroup.now.receiveMessage('New user joined the room', this.now.name);
    this.now.serverRoom = newRoom;
};

/////////////////
// STATIC ROUTES
////////////////

//Admin Route
app.get(/^\/[a-zA-Z0-9]{15}(|\/setup)(|\/globe)(|\/map)(|\/?)$/, function(req, res){
   res.sendfile('public/index.html');
});

//View Route
app.get(/^\/[a-zA-Z0-9]{10}(|\/globe)(|\/map)$/, function(req, res){
   res.sendfile('public/index.html');
});

//Test Query Route
app.get(/^\/[a-zA-Z0-9]{10}(|\/query)$/, function(req, res){
   res.sendfile('public/query.html');
});

///////////
// DATA API
///////////

//Models 

var Point = mongoose.model('Point', new mongoose.Schema({
	collectionid: String, 
	loc: Array,
	val: Number,
	label: String,
	datetime: Date,
	created: Date,
	modified: Date,	
}));

var PointCollection = mongoose.model('PointCollection', new mongoose.Schema({
	collectionid: String, // TODO: deprecated
	title: String,
	maxval: Number,
	minval: Number,
	timebased: Boolean,
	created: Date, 
	modified: Date,
	created_by: String,
	modified_by: String,
	defaults: mongoose.Schema.Types.Mixed,
	active: Boolean,
	progress: Number	
}));

var Map = mongoose.model('Map', new mongoose.Schema({
	title: String,
	description: String,
	adminslug: String,
	publicslug: String,
	created: Date,
	modified: Date,
	created_by: String,
	modified_by: String,
	collections: Array
}));

var Tweet = mongoose.model('Tweet', new mongoose.Schema({
	collectionid: String,
	mapid: String,
}));

var TweetCollection = mongoose.model('TweetCollection', new mongoose.Schema({
	collectionid: String,
	mapid: String,
	name: String,
}));

var Chat = mongoose.model('Chat', new mongoose.Schema({
	mapid: String,
	name: String,
	text: String,
	date: Date,
}));

var Comment = mongoose.model('Comment', new mongoose.Schema({
	commentid: Number,
	mapid: String,
	name: String,
	text: String,
	date: Date,
}));

// Routes

/////////////////////
// DATA POST ROUTES 
////////////////////

app.post('/api/data/:file', function(req, res){
	
	var file = req.params.file;
	var path = '/public/data/' + req.params.file;
	var type =  file.split('.').pop();
	
	switch(req.body.converter) {
		
		case 'Standard (loc, val, date)':
			
			var converter = {
				val: function() {
					return parseFloat(this.get('val'));
				}
				,datetime: function() {
					var d = Date.parse(String(this.get('date')));
					return new Date(d);
				}
				,loc: function() {
					var loc = this.get('loc').split(', ');
					return [parseFloat(loc[1]), parseFloat(loc[0])];
				}
			};
			
		break;
		
		case 'Earthquake Dataset':
		
			var converter = {
				val: function() {
					return parseFloat(this.get('mag'));
				}
				,datetime: function() {
					var d = Date.parse(String(this.get('year')), String(this.get('month')), String(this.get('day')));
					return new Date(d);
				}
				,loc: function() {
					var loc = this.get('location').split(', ');
					return [parseFloat(loc[1]), parseFloat(loc[0])];
				}
			};
		
		break;
		
		case 'Nuclear Reactors':
		
			var converter = {
				val: function() {
					return parseFloat(this.get('val'));
				}
				,datetime: function() {
					var d = Date.parse(String(this.get('year')));
					return new Date(d);
				}
				,loc: function() {
					var loc = this.get('location').split(', ');
					return [parseFloat(loc[1]), parseFloat(loc[0])];
				}
			};
			
		break;
		
		case 'Safecast Dataset':
		
			var converter = {
				val: function() {
					return parseFloat(this.get('reading_value'));
				}
				,datetime: function() {
					var d = Date.parse(this.get('reading_date'));
					return new Date(d);
				}
				,loc: function() {
					return [parseFloat(this.get('longitude')), parseFloat(this.get('latitude'))];
				}
			};
		
		break;
		
		default:
	}

	var importCount = 0;
	var fieldNames;
	var FIRST_ROW_IS_HEADER = true;
	var originalCollection = 'o_' + new mongoose.Types.ObjectId();
	var Model = mongoose.model(originalCollection, new mongoose.Schema({ any: {} }), originalCollection);
	
	var convertOriginalToPoint = function(data, converters) {
		var doc = {};
		for (var destField in converters) {
			var f = converters[destField];
			doc[destField] = f.apply(data);
		}
		return new Point(doc);
	}

	console.log('importing '+type);
	
	var defaults = {
		visible: true,
		displayType: 1,
		colorHigh: '#FF8888',
		colorLow: '#88FF88',
		color: '#88FF88',
		colorType: 1,
	};

	for (var key in defaults) {
		if (req.body[key]) {
			defaults[key] = req.body[key];
		}
	}
	
	var collection = new PointCollection({
	    name: req.params.name,
		defaults: defaults,
		active: false,
		title: req.body.title,
		progress: 0
	});

	var maxVal, minVal;

	collection.save(function(err, collection) {
	    if (!err) {
	    	var newCollectionId = collection.get('_id');
	    	console.log('created PointCollection "'+collection.get('title')+'" = '+newCollectionId);
			var response = {
				'pointCollectionId': collection.get('_id'),
			};
			res.send(response);

			switch(type) {
				case 'csv':

				csv()
				    .fromPath(__dirname+ path)
				    .transform(function(data){
				        data.unshift(data.pop());
				        return data;
				    })
				    .on('data',function(data,index){
						if (FIRST_ROW_IS_HEADER && !fieldNames) {
							fieldNames = data;
						} else {
							if (FIRST_ROW_IS_HEADER) {
								var doc = {};
								for (var i = 0; i < fieldNames.length; i++) {
									doc[fieldNames[i]] = data[i];
								}
							} else {
								doc['data'] = data;
							}
							var model = new Model(doc);
							model.save(); 
							
							var point = convertOriginalToPoint(model, converter);
							point.collectionid = newCollectionId;
							point.save();
							
							if (maxVal == undefined || maxVal < point.get('val')) {
								maxVal = point.get('val');
							}

							if (minVal == undefined || minVal > point.get('val')) {
								minVal = point.get('val');
							}

							delete model;
							delete doc;
							delete point;

							importCount++;
							if (importCount == 1 || importCount % 1000 == 0) {
								console.log('saved ' + importCount + ' points to '+newCollectionId);
							}
						}
			
				    })
				    .on('end',function(count){
				    	collection.maxval = maxVal;
						collection.minval = minVal;
						collection.active = true;
						collection.collectionid = collection.get('_id'); // TODO: deprecated
						collection.save();
				    	console.log('finalized and activated collection');
				    })
				    .on('error',function(error){
				        console.log(error.message);
				    });
				break;
			
				case 'json':
			
					console.log('/public/data/reactors.json');
					var parsedJSON = require('/public/data/reactors.json');
					//console.log(parsedjson);
			
				break;
				default: 
			}
		}
	});
});

/////////////////////
// MAP REDUCE ROUTES 
////////////////////

app.get('/api/safecast/:zoom', function(req, res){
	
	Safecast = mongoose.model('Safecast', new mongoose.Schema({ any: {} }), 'safecast_grid_' + req.params.zoom);
	Safecast.find(function(err, datasets) {
	   res.send(datasets);
	});
	
});

/////////////////
// COMMENTS 
////////////////

app.get('/api/comments/map/:mapid', function(req, res){
  Comment.find({mapid:req.params.mapid},function(err, datasets) {
     res.send(datasets);
  });
});

app.post('/api/comment/:commentid/:mapid/:lat/:lon/:name/:text/:date', function(req, res){
  var comment;
  comment = new Comment({
	commentid: 	req.params.commentid,
	mapid: 		req.params.mapid,
	lat: 		req.params.lat,
	lon: 		req.params.lon,
    name: 		req.params.name,
	text: 		req.params.text, 
	date: 		req.params.date,
  });

  comment.save(function(err) {
    if (!err) {
	 	res.send(comment);
    } else
	{
		res.send('oops', 500);
	}
  });
});

///////////////
// LIVE CHAT 
///////////////

app.get('/api/chat/:mapid', function(req, res){

  Chat.find({mapid:req.params.mapid},function(err, datasets) {
     res.send(datasets);
  });
});

app.post('/api/chat/:mapid/:name/:text/:date', function(req, res){
  var chat;
  chat = new Chat({
	mapid: 		req.params.mapid,
    name: 		req.params.name,
	text: 		req.params.text, 
	date: 		req.params.date,
  });

  chat.save(function(err) {
    if (!err) {
	 	res.send(chat);
    } else
	{
		res.send('oops', 500);
	}
  });
});

///////////////
// POINTS 
///////////////

app.get('/api/points', function(req, res){
  Point.find(function(err, datasets) {
     res.send(datasets);
  });
});

app.get('/api/point/:id', function(req, res){
  Point.findById(req.params.id, function(err, data) {
    if (!err) {
       res.send(data);
    } else
	{point
		res.send("oops",500);
	}
  });
});

app.put('/api/point/:id', function(req, res){
  Point.findById(req.params.id, function(err, point) {
	
	point.collectionid 	= req.body.collectionid;
    point.name 			= req.body.name;
    point.location 		= req.body.location;
	point.lat 			= req.body.lat;
	point.lon 			= req.body.lon;
	point.val		 	= req.body.val;
	point.color		 	= req.body.color;

    point.save(function(err) {
		if (!err) {
      		res.send(point);
		}
		else
		{
			res.send('ooops', 500);
		}
    });
  });
});

app.post('/api/point', function(req, res){
  var point;
  point = new Point({
	collectionid: 		req.body.collectionid,
    name: 		req.body.name,
	location: 	req.body.location,
	lat: 		req.body.lat,
	lon: 		req.body.lon,
	val: 		req.body.val,
	color:      req.body.color 
  });
  point.save(function(err) {
    if (!err) {
	 	res.send(point);
    } else
	{
		res.send('oops', 500);
	}
  });
});

app.delete('/api/point/:id', function(req, res){
  return Point.findById(req.params.id, function(err, point) {
    return point.remove(function(err) {
		if (!err) {
        	console.log("removed");
        	res.send('')
      	} else
		{
			res.send('oops', 500);
		}
    });
  });
});

//////////////////////
// POINT COLLECTIONS
//////////////////////

var ZOOM_TO_GRID = {
	1: .5
};

app.get('/api/mappoints/:pointcollectionid', function(req, res){
	


	zoom = req.params.zoom || 1;
	console.log(zoom);

	var collectionName = 'r_points_loc-'+ZOOM_TO_GRID[zoom];
	console.log(collectionName);

	var ReducedPoint = mongoose.model(collectionName, new mongoose.Schema(), collectionName);

	var box = [[60, 0], [100, 50]];
	var query = {"value.loc" : {$within: {$box : box}}};

	console.log(ReducedPoint.find(query, function(err, datasets) {
		console.log(err);
		if (!err) {
			var points = [];
			for (var i = 0; i < datasets.length; i++) {
				var reduced = datasets[i].get('value');
				points.push({
					val: reduced.val.avg,
					loc: [reduced.loc[1], reduced.loc[0]]
				});
			}
			res.send(points);
		}
	}));

	return;

	Point.find({collectionid:req.params.pointcollectionid}, function(err, point) {
		if (!err) {
			res.send(point);
		}
		else
		{
			res.send('ooops', 500);
		}
  	}).sort('date', 1);

});

/*
app.get('/api/collection/distinct' , function(req, res){
		
	Point.collection.distinct("collectionid", function(err, data){
		if (!err) {
			res.send(data);
		} else
		{
			res.send("oops",500);
		}
	  });
});

app.get('/api/collection/:id', function(req, res){
	
	Point.find({collectionid:req.params.id}, function(err, point) {
		if (!err) {
			res.send(point);
		}
		else
		{
			res.send('ooops', 500);
		}
  }).sort('date', 1);
});

app.get('/api/collection/', function(req, res){
	
	Point.find({collectionid:req.params.id}, function(err, point) {
		if (!err) {
			res.send(point);
		}
		else
		{
			res.send('ooops', 500);
		}
  });
});
*/

app.post('/api/collection/:id', function(req, res){
		
	var point;
	  point = new Point({
		collectionid:  req.params.id,
	    name: 		req.body.name,
		location: 	req.body.location,
		lat: 		req.body.lat,
		lon: 		req.body.lon,
		val: 		req.body.val,
		color:      req.body.color 
	  });
	  point.save(function(err) {
	    if (!err) {
		 	res.send(point);
	    } else
		{
			res.send('oops', 500);
		}
	  });
});

app.post('/api/addpoints/:id', function(req, res){
		
	jsonObject = req.body.jsonpost;
	for(var i = 0; i < jsonObject.length; ++i)
	{	
		var point;	
		point = new Point({
			collectionid:  req.params.id,
		    label: 		jsonObject[i].label,
			loc: 		jsonObject[i].loc,
			val: 		jsonObject[i].val,
			datetime: 	jsonObject[i].datetime,
			created: 	jsonObject[i].created,
			modified: 	jsonObject[i].modified,
		  });	
				
		  point.save();
	}	
	res.send('');
});

app.delete('/api/collection/:id', function(req, res){
   Point.remove({collectionid:req.params.id}, function(err) {
      if (!err) {
        console.log("removed");
        res.send('')
      }
      else {
		res.send('oops error', 500);
	  }
  });
});

//Associative Collection (keeps track of collection id & name)
app.get('/api/pointcollection/:id', function(req, res){
	PointCollection.findOne({_id: req.params.id, active: true}, function(err, pointCollection) {
		if (!err && pointCollection) {
			res.send(pointCollection);
		} else {
			res.send('ooops', 404);
		}
  });
});

//Return all Point Collections
app.get('/api/pointcollections', function(req, res){
  PointCollection.find({active: true}, function(err, datasets) {
     res.send(datasets);
  });
});

//Post a Point Collection
app.post('/api/pointcollection/:id/:name/:mapid/:maxval/:minval', function(req, res){
	
	var defaults = [{
		visible 	: 	req.body.jsonpost[0],
		displayType : 	req.body.jsonpost[1],
		colorHigh 	: 	req.body.jsonpost[2],
		colorLow 	: 	req.body.jsonpost[3],
		color 		: 	req.body.jsonpost[4],
		colorType 	: 	req.body.jsonpost[5],
	}];
	
	var collection;
	  collection = new PointCollection({
		collectionid: req.params.id,
	    name: req.params.name,
		mapid: req.params.mapid,
		maxval: req.params.maxval,
		minval: req.params.minval,
		defaults: defaults,
	  });
	  collection.save(function(err) {
	    if (!err) {
		 	res.send(collection);
	    } else
		{
			res.send('oops', 500);
		}
	  });
});

//Delete a Post Collection
app.delete('/api/pointcollection/:id', function(req, res){
	
	PointCollection.remove({collectionid:req.params.id}, function(err) {
	      if (!err) {
	        console.log("removed pointcollection");
	        res.send('')
	      }
	      else {
			res.send('oops', 500);
		  }
	  });
});

//////////
// MAPS 
/////////

//Returns all unique maps
app.get('/api/uniquemaps' , function(req, res){
	
	Map.find(function(err, data) {
	    if (!err) {		
	       res.send(data);
	    } else
		{
			res.send("oops",500);
		}
	});
});

//Returns the collections associated with a unique map by mapId
app.get('/api/maps/:mapid' , function(req, res){
	
	PointCollection.find({mapid : req.params.mapid}, function(err, data){
		if (!err) {
			res.send(data);
		} else
		{
			res.send("oops",500);
		}
	});
});

//Returns a specific unique map by mapId
app.get('/api/map/:publicslug', function(req, res){
	
	Map.find({publicslug: req.params.publicslug}, function(err, data) {
	    if (!err) {
	       res.send(data);
	    } else
		{point
			res.send("oops",500);
		}
	});
});

//Returns a specific unique map by mapId in admin state
app.get('/api/map/admin/:adminslug', function(req, res){
	
	Map.find({adminslug: req.params.adminslug}, function(err, data) {
	    if (!err) {
	       res.send(data);
	    } else
		{
			res.send("oops",500);
		}
	});
});

//Create a new map
app.post('/api/map/:mapid/:mapadminid/:name', function(req, res){
	
	var currDate = Math.round((new Date).getTime() / 1000);
	var collections = {};
	
	var map;
	  map = new Map({
	
		title: req.params.name,
		description: '',
		adminslug: req.params.mapadminid,
		publicslug: req.params.mapid,
		created: currDate,
		modified: currDate,
		created_by: '',
		modified_by: '',
		collections: collections,
	
	  });	
	
	  map.save(function(err) {
	    if (!err) {
		 	res.send(map);
	    } else
		{
			res.send('oops', 500);
		}
	  });
});

app.post('/api/bindmapcollection/:publicslug/:pointcollectionid', function(req, res){
	
	var publicslug = req.params.publicslug;
    var pointcollectionid = req.params.pointcollectionid;

	console.log(req.body)

    var find = PointCollection.findOne({_id: pointcollectionid, active: true}, function(err, collection) {
	    if (err || !collection) {
			res.send('oops', 404);
			return;
	    }

	    var link = {
	    	collectionid: collection._id,
	    	defaults: collection.defaults
	    };

		Map.update({ publicslug:publicslug }, { $push : { collections: link} }, function(err) {
	      if (!err) {
	        console.log("collection bound to map");
	        res.send('');
	      } else {
			res.send('oops error', 500);
		  }
	  	});
    });
});

app.post('/api/updatemapcollection/:publicslug/:pointcollectionid', function(req, res){
	
	jsonObject = req.body.jsonpost;
	
	var publicslug = req.params.publicslug;
    var collectionid = req.params.pointcollectionid;

	var options = {
		visible : Boolean(jsonObject.visible),
		displayType : Number(jsonObject.displayType),
		colorHigh : String(jsonObject.colorHigh),
		colorLow : String(jsonObject.colorLow),
		color : String(jsonObject.color),
		colorType : Number(jsonObject.colorType)
	}
	
	var link = {
		collectionid: collectionid,
		defaults: options
	};

	Map.findOne({publicslug: publicslug}, function(err, map) {
		if (!err && map) {
			var keepCollections = [];
			for (var i = 0; i < map.collections.length; i++) {
				if (map.collections[i].collectionid != collectionid) {
					keepCollections.push(map.collections[i]);
					break;
				}
				else
				{
					keepCollections.push(link);
				}
			}
			map.collections = keepCollections;			
			map.save();	
			res.send('');
			
		} else {
			res.send('ooops', 404);
		}
	  	});
});

app.post('/api/unbindmapcollection/:publicslug/:collectionid', function(req, res){
	var publicslug =  String(req.params.publicslug);
    var collectionid = String(req.params.collectionid);
	
	Map.findOne({publicslug: publicslug}, function(err, map) {
		if (!err && map) {
			var keepCollections = [];
			for (var i = 0; i < map.collections.length; i++) {
				if (map.collections[i].collectionid != collectionid) {
					keepCollections.push(map.collections[i]);
					break;
				}
			}
			map.collections = keepCollections;			
			map.save();
		} else {
			res.send('ooops', 404);
		}
  	});
	
});

app.delete('/api/map/:mapid', function(req, res){
   Map.remove({mapid:req.params.mapid}, function(err) {
      if (!err) {
        console.log("map removed");
        res.send('')
      }
      else {
		res.send('oops error', 500);
	  }
  });
});

////////////
// TWEETS 
///////////

app.get('/tweetstream', function(req, res){
	
	// LON/LAT format
	//Japan Bounding Coordinates: 128.496094,30.524413,146.953125,45.213004
	//World Bounding Coordinates: -172.968750,-84.673513,172.968750,84.405941
	//San Fran Bounding Coordinates: -122.75,36.8,-121.75,37.8
	
	twit.stream('statuses/filter', {'locations':'128.496094,30.524413,146.953125,45.213004','track':['radiation','放射線','fukushima','福島県','safecast','geiger']}, function(stream) {
	      console.log('Twitter stream open...');
			stream.on('data', function (data) {

				console.log(data.text);
				console.log(data.geo);

				if(data.geo != null || data.location != undefined)
				{
					tweet = data.text
					if(tweet.search(/radiation|放射線|fukushima|福島県|safecast|geiger/i) != -1)
					{
						console.log(data.text);
						console.log(data.geo);

						latitude = data.geo.coordinates[0];
						longitude = data.geo.coordinates[1];

						var tweet;
						tweet = new Tweet({text:data.text, lat:latitude, lng:longitude});

						tweet.save(function(err) {
						    if (!err) {
								//
						    } else
							{
								//
							}
						});

					}				
				}
	      });
	});
});

app.get('/tweets', function(req, res){
	twit.search('',{geocode:'40.63971,-73.778925,100mi',rpp:'100'}, function(data) {		
		for (var key in data.results) {
			console.log(data.results[key].geo);
		}
	});	
});

app.get('/api/tweets', function(req, res){
  Tweet.find(function(err, datasets) {
     res.send(datasets);
  });
});

app.listen(8124, "0.0.0.0");
console.log('Server running at http://0.0.0.0:8124/');