var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
 
var dry_layers = require('dry-layers');
dry_layers.Registry.setDatabaseUrl('mongodb://localhost:27017/coderdojo');
dry_layers.DataService.connect();
app.use('/dry-layers', dry_layers.StaticService.createRouter());
var passport = require('passport');
passport.use(dry_layers.SecurityService.createStrategy());
passport.use('meeting', dry_layers.MeetingService.createStrategy());
var ObjectID = require('mongodb').ObjectID;
dry_layers.MeetingService.createUser = function () {
    return {
        _id : (new ObjectID()).toString(),
        pseudonym : 'Anonymous',
        roles : ['Ninja'],
        avatar : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFQSURBVHhe7dJBDcAwAAOxdPw5b32Mhc9SFAJ3tr13QT3/B1UAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsAXAHgCgBXALgCwBUArgBwBYArAFwB4AoAVwC4AsAVAK4AcAWAKwBcAeAKAFcAuALAFQCuAHAFgCsA2vYB0oQB/7EaM24AAAAASUVORK5CYII="
    } 
}
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', dry_layers.SecurityService.createRouter());
app.use('/', dry_layers.MeetingService.createRouter());
app.use('/avatars', dry_layers.DataService.createRouter('avatar'));
app.use('/dojos', dry_layers.DataService.createRouter('dojo'));
app.use('/meetings', dry_layers.DataService.createRouter('meeting'));
app.use('/users', dry_layers.DataService.createRouter('user'));
app.use('/administrator', require('./routes/administrator'));
app.use('/champion', require('./routes/champion'));
app.use('/mentor', require('./routes/mentor'));
app.use('/ninja', require('./routes/ninja'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
