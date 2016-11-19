var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs'),
five = require('johnny-five');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var http = require('http');
var server = http.createServer(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



var board = new five.Board();

board.on("ready", function() {

	var io = require('socket.io').listen(server);

	var led = new five.Led(3);

	console.log("board ready");

	io.on('connection', function (socket) {

		console.log("io connection");

		socket.on('ligar', function(){
			led.on();
		});

		socket.on('desligar', function(){
	  		//precisamos do stop caso o led esteja em strobe, senao apenas com off nao apaga
			led.stop().off();
		});

		socket.on('strobe', function(data){
			led.strobe(parseInt(data));
		});

		socket.on('disconnect', function(){
			led.stop().off();
		});

	}); 
});


server.listen(3000, function(){
	console.log("SERVER RUNNING...");
});

module.exports = app;
