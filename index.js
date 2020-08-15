var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var users = {};

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.on('connection', (socket) => {
	socket.emit('online users', users);

	socket.on('disconnect', () => {
		delete users[socket.id];
		io.emit('delete user', socket.id);
	});

	socket.on('broadcast', (data) => {
		socket.broadcast.emit('broadcast', data);
	});
	
	socket.on('private', (data) => {
		let id = Object.keys(data)[0];
		let temp = {};
		temp[socket.id] = data[Object.keys(data)[0]];
		io.to(id).emit('private', temp);
	});
	
	socket.on('new user', (user) => {
		if(user.trim() != '') {
			let temp = {};
			temp[socket.id] = user;			
			socket.broadcast.emit('new user', temp);
			users[socket.id] = user;
		}
	});
});

http.listen(port, () => {
	console.log('listening on *:' + port);
});
