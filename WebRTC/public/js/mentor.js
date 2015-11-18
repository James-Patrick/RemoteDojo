
var opts = {localCamBox:null, remoteCamBox:null, screenBox:null};
opts.localCamBox = document.getElementById("localCamBox");
opts.remoteCamBox;
opts.screenBox = document.getElementById("screenBox");

var helpQueue = document.getElementById("helpQueue");
var nameField = document.getElementById("nameField");

var firstPhase = document.getElementById("firstPhase");
var firstPhaseText = document.getElementById("firstPhaseText");

var secondPhase = document.getElementById("secondPhase");

var fullScreenButton = document.getElementById("screenFull");

var mentorAvatar = document.getElementById("mentorAvatar");

var socket = io();
var webrtc;

signOut.onclick = function() {
	jQuery.post('/sign_out', {}, function() {
		window.close();
	});
}

fullScreenButton.onclick = function() {
	var myVideo = opts.screenBox.getElementsByTagName('video');
	if (myVideo) {
		console.log(myVideo);
		var elem = myVideo[0];
		if (elem.requestFullscreen) {
		  elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
		  elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
		  elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
		  elem.webkitRequestFullscreen();
		}
	}
}

/*
	This function renders the ninja queue that this mentor is handling.
	At the moment, this is a simple array of names. This should change in a future iteration to include ids for those ninjas for guaranteed unique identification
*/
function renderBody(queue) {
	var div = helpQueue;
	div.innerHTML = '';
	if (queue) {
		$(firstPhaseText).text("There are " + queue.length + " ninjas waiting for help");
		queue.forEach(function(entry) {
			var b = document.createElement("div");
			$(b).addClass("btn btn-default btn-block input-sm");
			$(b).text(entry.name);
			b.onclick = function() {
				socket.emit('answerRequest', {ninja: entry});
				$(firstPhase).hide();
				$(secondPhase).show();
			}
			div.appendChild(b);
		});
	}
}

/* 	Function to handle new queue data.
	The argument should be an object with the entire new queue located in the data.queue field 
*/
function handleQueueUpdate(data) {
	console.log(data);
	renderBody(data.queue);
}

/*	Function to handle the changing of room.
	The data should include fields defining the name of the room and the name of ninja who will be joining 
*/
function handleRoomChange(data) {
	console.log('Changing to room: ' + data.room);
	setRoom(data.room);
	$('#ninjaName').text(data.ninja);
	$(opts.screenBox).empty();
	$(opts.localCamBox).empty();
	$(chatWindow).empty();
	webrtc.startLocalVideo();
}

/*
	Function to handle the receiving of ice server info.
	This the data packet should be exactly what is returned by xirsys concerning ICE connection details. Hence, all the data will be in the data.d field.
*/
function handleIceServers(data) {
	console.log(data);
	console.log(data.d);
	webrtc = webrtcInit(data.d, opts, true);
	console.log(webrtc);
}

/*
	This function should handle the event of the ninja disconnecting from the system during a session.
*/
function handleNinjaDisconnect(data) {
	webrtc.stopLocalVideo();
	alert("The ninja you were communicating with left");
	$(secondPhase).hide();
	$(firstPhase).show();
}

function handleBadAvatar(){
	mentorAvatar.onerror = "";
	mentorAvatar.src= "/img/mentor.png";
	return true;
}

document.onunload = function(){
	if (webrtc) {
		webrtc.stopLocalVideo();
		webrtc.leaveRoom();
		webrtc.connection.disconnect();
		webrtc = null;
	}
}

socket.on('queueUpdate', handleQueueUpdate);
socket.on('changeRoom', handleRoomChange);
socket.on('iceServers', handleIceServers);
socket.on('otherDisconnect', handleNinjaDisconnect);

$.ajax({
	dataType: "json",
	error: function(jqXHR, textStatus, errorThrow) {
		alert('AHHHH');
	},
	success: function(data, textStatus, jqXHR) {
		$(nameField).text(data.firstName);
		socket.emit('iceRequest',{mentor : data.firstName});
	},
	type: "GET",
	url: "/users/signed_in"
});

$(firstPhase).show();
$(secondPhase).hide();
$('#collapseTwo').collapse("hide");
//socket.emit('iceRequest', {mentor : getParameterByName('user')});
