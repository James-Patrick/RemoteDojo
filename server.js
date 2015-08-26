// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    https = require('https'),
    http = require('http');
var request = require('request');
var socketio = require('socket.io');


var privateKey = fs.readFileSync('fakekeys/privatekey.pem').toString(), certificate = fs.readFileSync('fakekeys/certificate.pem').toString();

var app = express();

// The help queue takes the form of a single array of socket ids
var queue = [];
var clients = {};


// Currently we use static navigation through webpages
app.use(express.static(__dirname));

// Here we create the secure server
var sServer = https.createServer({key: privateKey, cert: certificate}, app);
// And listen on the port
sServer.listen(8000);

// Attach the websocket handling
var io = socketio(sServer);

// Function to communicate with the Xirsys api and delete a room
function deleteRoom (roomName) {
	console.log('deleting room: ' + roomName);
	var apiKey = 'f61ef9ac-2510-11e5-92dd-24621fb60816';
	var domain = 'dojodev.com';
	var myApplication = 'dojo';
	
	var options = {
		url:"https://service.xirsys.com/room",
		method:"DELETE",
		form: {
			'ident': 'jamesuwa',
			'secret': apiKey,
			'domain': domain,
			'application': myApplication,
			'room': roomName
			}
	};
	request(options, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			console.log(body)
		}
		else {
			console.log('Something bad happened\n' + body + '\n' + err + '\n' + response.statusCode);
		}
	});
}

// Function to communicate with the xirsys api to create a room
function createRoom (roomName) {
	console.log('creating room: ' + roomName);
	var apiKey = 'f61ef9ac-2510-11e5-92dd-24621fb60816';
	var domain = 'dojodev.com';
	var myApplication = 'dojo';
	
	var options = {
		url:"https://service.xirsys.com/room",
		method:"POST",
		form: {
			'ident': 'jamesuwa',
			'secret': apiKey,
			'domain': domain,
			'application': myApplication,
			'room': roomName
			}
	};
	request(options, function (err, response, body) {
		if (!err && response.statusCode == 201) {
			console.log(body)
		}
		else {
			console.log('Something bad happened\n' + body + '\n' + err + '\n' + response.statusCode);
		}
	});
}

// Function to communicate with the xirsys api to get ICE Server info
// Currently uses the legacy api, should be changed in the near future
function getIceServers (cb) {
	var apiKey = fs.readFileSync('secretApiKey').toString();
	var options = {
		url:"https://api.xirsys.com/getIceServers",
		method:"POST",
		form: {
			'ident': "jamesuwa",
			'secret': apiKey,
			'domain': "www.testdev.com",
			'application': 'default',
			'room': "default",
			'secure': 1
		}
	};
	request(options, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			cb(body, null);
		} else {
			cb(null, response);
		}
	});
}


function removeFromQueue (ninja) {
	var i = 0;
	while (i < queue.length && queue[i].id != ninja.id) i++;
	if (i < queue.length) { 
		queue.splice(i,1);
		io.emit('queueUpdate', {queue : queue});
	}
	
}

// These are all the socket responses that the server will handle
io.on('connection', function (socket, error) {
	var me = {}
	me.id = socket.id;
	me.roomName = me.id.replace('_','');
	clients[me.id] = me;
	// When the client requests ice servers
	socket.on('iceRequest', function (data) {
		if (data.mentor) {
			me.name = data.mentor;
			me.mentor = 1;
			console.log('The mentor ' + me.name + ' has joined');
			socket.emit('queueUpdate',{queue:queue});
			createRoom(me.roomName);
		} else if (data.ninja) {
			me.name = data.ninja;
			me.ninja = 1;
			console.log('The ninja ' + me.name + ' has joined');
		} else {
			console.log('An unknown user has entered the system');
			return;
		}
		getIceServers(function (data, err) {
			if (!err) {
				console.log('Sent out ice server info');
				socket.emit('iceServers', JSON.parse(data));
			}
		});
	});
	
	// This event is fired by a mentor who would like to help a ninja. The data includes the name of the ninja.
	socket.on('answerRequest', function (data) {
		helpee = clients[data.ninja.id];
		console.log(me.name + ' would like to help ' + helpee.name);
		// This cuts the ninja out of the help queue
		removeFromQueue(helpee)
		// Being told to change room is the trigger for both mentor and ninja to get ready to and begin communication
		helpee.pairing = me;
		me.pairing = helpee;
		
		socket.emit('changeRoom', {room: me.roomName, mentor:me.name, ninja:helpee.name});
		socket.broadcast.to(helpee.id).emit('changeRoom', {room: me.roomName, mentor:me.name, ninja:helpee.name});
		io.emit('queueUpdate', {queue : queue});
	});
	// This event is fired when a ninja requests help. Data is just the ninja's name.
	socket.on('requestHelp', function(data) {
		console.log(me.name + ' is requesting help');
		queue.push(me);
		io.emit('queueUpdate', {queue : queue});
	});
	
	// This event is fired when the ninja clicks the button to disconnect from the mentor-ninja session
	socket.on('leaving', function(data) {
		if (me.pairing) {
			socket.broadcast.to(me.pairing.id).emit('otherDisconnect');
			me.pairing.pairing = null;
			me.pairing = null;
		}
	});
	
	socket.on('pm', function(data) {
		socket.broadcast.to(me.pairing.id).emit('pm',data);
	});
	
	// We care about when people disconnect from the server because the help queue needs to be updated if they were in it and it needs to inform the other party if the disconnecting party was in a communication session
	socket.on('disconnect', function() {
		removeFromQueue(me);
		if (me.pairing) {
			socket.broadcast.to(me.pairing.id).emit('otherDisconnect');
			me.pairing.pairing = null;
		}
		if (me.mentor) {
			deleteRoom(me.roomName);
		}
		console.log(me.name + ' has disconnected from the system');
		clients[me.id] = null;
	});
});

console.log('running on https://localhost:8000');
