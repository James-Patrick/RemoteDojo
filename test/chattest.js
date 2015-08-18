var $ = require('jQuery');
$.getScript("../chat.js", function(){
	console.log("attempting to import chat.js");
});

describe('chat', function () {
 it('should run a test', function (done) {
   var result = testcept();
   result.should.equal(2);
   done();
 });
});