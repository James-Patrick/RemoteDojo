var io = require('socket.io-client')
var should = require('should');
var mentorSocket;
var ninjaSocket;

var queue;

describe('Basic Server Test', function() {
	this.timeout(10000);
	
	before(function() {
		mentorSocket = io('https://localhost:8000',{forceNew: true});
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
	});
	
	after(function() {
		mentorSocket.disconnect();
		ninjaSocket.disconnect();
	});

	
	describe('#mentorIceRequest', function() {
		it('Returns a valid ice server', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			mentorSocket.once('iceServers', test);
			mentorSocket.emit('iceRequest', {mentor:'Test Mentor'});
		});
	});
	
	describe('#ninjaIceRequest', function() {
		it('Returns a valid ice server', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			ninjaSocket.once('iceServers', test);
			ninjaSocket.emit('iceRequest', {ninja:'Test Ninja'});
		});
	});
	
	describe('#ninjaJoinQueue', function() {
		it('Updates the queue when a ninja joins the queue', function(done) {
			function test(data) {
				should.exist(data);
				data.should.have.property('queue').with.lengthOf(1);
				data.queue[0].should.have.property('name','Test Ninja');
				queue = data.queue;
				done();
			};
			mentorSocket.once('queueUpdate', test);
			ninjaSocket.emit('requestHelp');
		});
	});
	
	describe('#mentorAccept', function() {
		var queueUpdate = 0;
		var roomUpdate = 0;
		it('Updates queue when mentor accepts request and room is received correctly', function(done){
			function checkDone() {
				if (roomUpdate == 2 && queueUpdate == 1) {
					done();
				}
			}
			function testQueue(data) {
				should.exist(data);
				data.should.have.property('queue').with.lengthOf(0);
				queueUpdate++;
				checkDone()
			};
			function testRoom(data) {
				should.exist(data);
				data.should.have.property('mentor', 'Test Mentor');
				data.should.have.property('ninja', 'Test Ninja');
				roomUpdate++;
				checkDone()
			};
			should.exist(queue[0]);
			queue[0].should.have.property('name','Test Ninja');
			mentorSocket.once('queueUpdate', testQueue);
			mentorSocket.once('changeRoom', testRoom);
			ninjaSocket.once('changeRoom', testRoom);
			mentorSocket.emit('answerRequest',{ninja : queue[0]});
		});
	});
	
	describe("#personalMessages", function() {
		it('sends messages from ninja to mentor', function(done) {
			function testMentorMessage(data) {
				should.exist(data);
				data.should.have.property('message', 'Test message from ninja');
				done();
			}
			mentorSocket.once('pm',testMentorMessage);
			ninjaSocket.emit('pm', {message : 'Test message from ninja'});
		});
		
		it('sends messages from mentor to ninja', function(done) {
			function testNinjaMessage(data) {
				should.exist(data);
				data.should.have.property('message', 'Test message from mentor');
				done();
			}
			ninjaSocket.once('pm',testNinjaMessage);
			mentorSocket.emit('pm', {message : 'Test message from mentor'});
		});
	});
	
	describe('#ninjaLeaving', function() {
		it('insforms mentor that the ninja has left', function(done) {
			mentorSocket.once('otherDisconnect', done);
			ninjaSocket.emit('leaving');
		});
	});
});