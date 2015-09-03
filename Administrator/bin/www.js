#!/usr/bin/env node

var debug = require('debug')('Administrator');
var mongo = require('mongodb');
mongo.MongoClient.connect('mongodb://localhost:27017/coderdojo', function (err, db) {
	var dry = require('dry-layers');
	if (err) {
		if (db) {
			db.close();
			db = null;
		}
		dry.Registry.setError(err);
		console.log(err.stack);
	}
	dry.Registry.setDatabase(db);
	var app = require('../app.js');
	app.set('port', process.env.PORT || 8001);
	var server = app.listen(app.get('port'), function () {
		debug('Express server listening on port ' + server.address().port);
	});
});
