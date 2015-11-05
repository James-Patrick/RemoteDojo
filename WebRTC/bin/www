#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs = require('fs');
var app = require('../app');
var debug = require('debug')('webrtc:server');
var https = require('https');
var sockets = require('../socketServer');
//var dryLayers = require('dry-layers');

// Retrieve private key and certificate from the fakekeys folder
var privateKey = fs.readFileSync('./fakekeys/privatekey.pem').toString(), certificate = fs.readFileSync('./fakekeys/certificate.pem').toString();

//var application = new dryLayers.Application(app);
//application.setDatabaseUrl('mongodb://localhost:27017/coderdojo');

/**
 * Get port from environment and store in Express.
 */

//var port = normalizePort(process.env.PORT || '8000');
var port = normalizePort('8000');

/**
 * Create HTTPS server.
 */

var server = https.createServer({key: privateKey, cert: certificate},app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(8000);
// dryLayers.Registry.setApplication(application);

// Connects the Socket.IO logic to the newly created server.
sockets.attach(server);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
