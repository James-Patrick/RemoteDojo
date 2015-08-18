var room = 'default';

function setRoom(newRoom) {
	room = newRoom;
}

function webrtcInit(peerConnectionConfig, opts) {
	// Create the SimpleWebRTC object
	var webrtc = new SimpleWebRTC({
		// Holder for the local webcam
		localVideoEl: opts.localCamBox,
		remoteVideosEl: '',
		autoRequestMedia: false,
		debug: false,
		detectSpeakingEvents: false,
		autoAdjustMic: false,
		// Add the new peerConnectionConfig object
		peerConnectionConfig: peerConnectionConfig
	});
	
	webrtc.on('readyToCall', function() {
		console.log('Ready to call');
		console.log('connecting to room: ' + room);
		webrtc.joinRoom(room);
	});
	
	webrtc.on('videoAdded', function (video, peer) {
		var inType = peer.type;
		var container;
		if (inType == 'video') {
			container = opts.remoteCamBox;
		} else {
			container = opts.screenBox;
		}
		if (container) {
			var newContainer = document.createElement('div');
			newContainer.id = 'container_' + webrtc.getDomId(peer);
			$(newContainer).addClass("video-box embed-responsive embed-responsive-4by3");
			$(video).addClass("embed-responsive-item");
			newContainer.appendChild(video);
			container.appendChild(newContainer);
		}
	});
	
	webrtc.on('videoRemoved',function (video, peer) {
		var container;
		if (peer) {
			var inType = peer.type;
			var el = document.getElementById('container_' + webrtc.getDomId(peer));
			if (inType == 'video') {
				container = remoteCamBox;
			} else {
				container = screenBox;
			}
			if (container && el) {
				container.removeChild(el);
			}
		} else { // Thanks &yet for this silly case for local screen removal
			container = opts.screenBox;
			var screen = document.getElementById('localScreen');
			if (container && screen) {
				container.removeChild(screen);
			}
		}
	});

	webrtc.on('localScreenAdded', function(video) {
		if (opts.screenBox) {
			video.id = 'localScreen';
			opts.screenBox.appendChild(video);
		}
	});
	
	return webrtc;
};