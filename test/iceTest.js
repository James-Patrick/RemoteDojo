var io = require('socket.io-client')
var should = require('should');
var mentorSocket;
var ninjaSocket;
var queue;

describe('Server Tests', function() {
	before(function() {
		mentorSocket = io('https://localhost:8000',{forceNew: true});
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
		mentorSocket.on('queueUpdate', function(data) {
			queue = data.queue;
		});
	});
	
	after(function() {
		mentorSocket.disconnect();
		ninjaSocket.disconnect();
	});
	
	describe('#mentorIceRequest', function() {
		it('Should return a valid ice server', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			mentorSocket.on('iceServers', test);
			mentorSocket.emit('iceRequest', {mentor:'Test Mentor'});
		});
	});
	
	describe('#ninjaIceRequest', function() {
		it('Should return a valid ice server', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			ninjaSocket.on('iceServers', test);
			ninjaSocket.emit('iceRequest', {ninja:'Test Ninja'});
		});
	});
	
});