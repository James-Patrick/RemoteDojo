// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    https = require('https'),
    http = require('http');
var request = require('request');
var socketio = require('socket.io');


var privateKey = fs.readFileSync('fakekeys/privatekey.pem').toString(),
    certificate = fs.readFileSync('fakekeys/certificate.pem').toString();

var app = express();

// This is the current representation of the help queue. It has a ninja and socket field, relating a ninja's name to their unique socket id.
var queue = {ninja:[], socket:[]};

// Currently we use static navigation through webpages
app.use(express.static(__dirname));

// Here we create the secure server
var sServer = https.createServer({key: privateKey, cert: certificate}, app);
// And listen on the port
sServer.listen(8000);

// Attach the websocket handling
var io = socketio(sServer);
// A list of all connected clients, this is primarily used for tracking when people leave and responding correctly. It could also be useful for logging.
var connectedClients = {name:[], socket:[], mentor:[]};
// This keeps track of all current pairings between ninjas and mentors. It exists to allow ninjas to be tracked to the mentor helping them and vice versa
var pairings = {ninja: [], mentor: []};

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

// These are all the socket responses that the server will handle
io.on('connection', function (socket, error) {
	// When the client requests ice servers
	socket.on('iceRequest', function (data) {
		// Mentors do this at page load and receive a queue update too
		if (data.mentor) {
			connectedClients.socket.push(socket.id);
			connectedClients.name.push(data.mentor);
			connectedClients.mentor.push('true');
			socket.emit('queueUpdate', {queue : queue.ninja});
			console.log('The mentor ' + data.mentor + ' has joined');
			createRoom(data.mentor);
		} else if (data.ninja) {
			connectedClients.socket.push(socket.id);
			connectedClients.name.push(data.ninja);
			connectedClients.mentor.push('false');
			console.log('The ninja ' + data.ninja + ' has joined');
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
		console.log(data.mentor + ' would like to help ' + data.ninja);
		var index = queue.ninja.indexOf(data.ninja);
		var helpee = queue.socket[index];
		var helper = socket.id;
		// This puts the pair into the pairings list
		pairings.ninja.push(helpee);
		pairings.mentor.push(helper);
		// This cuts the ninja out of the help queue
		queue.socket.splice(index, 1);
		queue.ninja.splice(index, 1);
		io.emit('queueUpdate', {queue : queue.ninja});
		// Being told to change room is the trigger for both mentor and ninja to get ready to and begin communication
		socket.emit('changeRoom', {room: data.mentor, mentor:data.mentor, ninja:data.ninja});
		socket.broadcast.to(helpee).emit('changeRoom', {room: data.mentor, mentor:data.mentor, ninja:data.ninja});
	});
	// This event is fired when a ninja requests help. Data is just the ninja's name.
	socket.on('requestHelp', function(data) {
		console.log(data.ninja + ' is requesting help');
		queue.ninja.push(data.ninja);
		queue.socket.push(socket.id);
		io.emit('queueUpdate', {queue : queue.ninja});
	});
	
	// This event is fired when the ninja clicks the button to disconnect from the mentor-ninja session
	socket.on('leaving', function(data) {
		console.log(pairings);
		var index = pairings.ninja.indexOf(socket.id);
		if (index > -1) {
			pairings.ninja.splice(index, 1);
			socket.broadcast.to(pairings.mentor.splice(index,1)[0]).emit('otherDisconnect');
		}
	});
	
	socket.on('pm', function(data) {
		var index = pairings.ninja.indexOf(socket.id);
		if (index > -1) {
			socket.broadcast.to(pairings.mentor[index]).emit('pm', data);
		} else {
			index = pairings.mentor.indexOf(socket.id);
			if (index > -1) {
				socket.broadcast.to(pairings.ninja[index]).emit('pm' ,data);
			}
		}
	});
	
	// We care about when people disconnect from the server because the help queue needs to be updated if they were in it and it needs to inform the other party if the disconnecting party was in a communication session
	socket.on('disconnect', function() {
		var index = queue.socket.indexOf(socket.id);
		if (index > -1) {
			queue.socket.splice(index, 1);
			var ninja = queue.ninja.splice(index, 1);
			io.emit('queueUpdate', {queue : queue.ninja});
			console.log(ninja + ' was waiting for help but disconnected')
		}
		var index2 = connectedClients.socket.indexOf(socket.id);
		if (index2 > -1) {
			connectedClients.socket.splice(index2, 1);
			var name = connectedClients.name.splice(index2, 1)[0];
			var mentor = connectedClients.mentor.splice(index2, 1)[0];
			if (mentor == 'true') {
				console.log('The mentor ' + name + ' just disconnected');
				var index3 = pairings.mentor.indexOf(socket.id);
				if (index3 > -1) {
					pairings.mentor.splice(index3, 1);
					socket.broadcast.to(pairings.ninja.splice(index3,1)[0]).emit('otherDisconnect');
				}
				deleteRoom(name);
			} else {
				var index3 = pairings.ninja.indexOf(socket.id);
				if (index3 > -1) {
					pairings.ninja.splice(index3, 1);
					socket.broadcast.to(pairings.mentor.splice(index3,1)[0]).emit('otherDisconnect');
				}
				console.log('The ninja ' + name + ' just disconnected');
			}
		}
	});
});

console.log('running on https://localhost:8000');
