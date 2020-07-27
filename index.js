var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', (socket) => {
	console.log('a user connected');
	
	socket.on('disconnect', () => {
		console.log('a user disconnected');
	});
	
	socket.on('message', (message) => {
		if(message.trim() != '')
			socket.broadcast.emit('message', message);
	});
});

http.listen(2000, () => {
	console.log('listening on *:2000');
});
