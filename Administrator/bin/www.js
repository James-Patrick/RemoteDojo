// #!/usr/bin / env node
var debug = require('debug')('Administrator');
var app = require('../app');
var http = require('http');

app.set('port', process.env.PORT || 3000);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
