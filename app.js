var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

//socket.io
var socketApp = express();
var socketServer = require('http').Server(socketApp);
var io = require('socket.io')(socketServer);
/* io.on('connection', function(socket) {
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	io.emit('some event', { for: 'everyone' });
	socket.broadcast.emit('hi','broadcast');

}); */
//namespace 
var chanel1 = io.of(1);
chanel1.on('connection',function(socket){
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	socket.on('chat message', function(msg) {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	chanel1.emit('some event', { for: 'everyone' });
	socket.broadcast.emit('hi','broadcast');
})

socketServer.listen(8080, function() {
	console.log('socket listening on *:8080');
});

module.exports = app;