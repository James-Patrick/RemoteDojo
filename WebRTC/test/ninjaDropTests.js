var io = require('socket.io-client')
var should = require('should');
var mentorSocket;
var ninjaSocket;
var queue;

describe('Ninja disconnection Test', function() {
	this.timeout(10000);
	
	before(function() {
		mentorSocket = io('https://localhost:8000',{forceNew: true});
		ninjaSocket = io('https://localhost:8000',{forceNew: true});
	});
	
	after(function() {
		mentorSocket.disconnect();
	});
	
	beforeEach(function() {
	});
	
	afterEach(function() {
	});
	
	describe('#setUp', function() {
		it('Set up a mentor fine', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			mentorSocket.once('iceServers', test);
			mentorSocket.emit('iceRequest', {mentor:'Dropping Mentor'});
		});
		it('Set up a ninja fine', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			ninjaSocket.once('iceServers', test);
			ninjaSocket.emit('iceRequest', {ninja:'Dropping Ninja'});
		});
	});

	
	describe('#dropFromQueue', function() {
		it('updates queue when a ninja drops from it', function(done) {
			function getQueueTest(data) {
				should.exist(data);
				data.should.have.property('queue').with.lengthOf(0);
				done();
			};
			function getQueueFirst(data) {
				should.exist(data);
				data.should.have.property('queue').with.lengthOf(1);
				data.queue[0].should.have.property('name','Dropping Ninja');
				mentorSocket.once('queueUpdate', getQueueTest);
				setTimeout(ninjaSocket.io.disconnect(), 1000);
			};
			mentorSocket.once('queueUpdate', getQueueFirst);
			ninjaSocket.emit('requestHelp');
		});
	});
	
	describe('#dropFromSession', function() {
		it('Set up a ninja fine', function(done) {
			function test(data) {
				should.exist(data);
				should.not.exist(data.e);
				data.s.should.equal(200);
				should.exist(data.d);
				done();
			};
			ninjaSocket = io('https://localhost:8000',{forceNew: true})
			
			ninjaSocket.once('iceServers', test);
			ninjaSocket.emit('iceRequest', {ninja:'Dropping Ninja 2'});
		});
		
		it('informs mentor when ninja disconnects from session', function(done){
			function roomChange(data) {
				should.exist(data);
				data.should.have.property('room');
				setTimeout(ninjaSocket.io.disconnect(), 1000);
			};
			function connectToNinja(data) {
				should.exist(data);
				data.should.have.property('queue').with.lengthOf(1);
				data.queue[0].should.have.property('name','Dropping Ninja 2');
				mentorSocket.emit('answerRequest', {ninja : data.queue[0]});
			};
			mentorSocket.once('queueUpdate', connectToNinja);
			ninjaSocket.once('changeRoom', roomChange);
			mentorSocket.once('otherDisconnect', done);
			ninjaSocket.emit('requestHelp');
		});
	});
});