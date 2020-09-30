var socket = io();
var selectedUser = 'everyone';
var savedUsername;
var calcMessages = 0;
var i = 0;

function openUsername() {
	let x = document.getElementById('username-modal');
	let y = document.getElementById('modal-background');
	
	x.classList.add("show-modal");
	y.style.display = "block";
	
	document.getElementById('username').focus();
}

function openPrivacy() {
	let x = document.getElementById('privacy-modal');
	let y = document.getElementById('modal-background');
	
	x.classList.add("show-modal");
	y.style.display = "block";
}

function openAbout() {
	let x = document.getElementById('about-modal');
	let y = document.getElementById('modal-background');
	
	x.classList.add("show-modal");
	y.style.display = "block";
}

function closeAll() {
	let a = document.getElementById('modal-background');
	
	if(document.getElementById('username-modal')) {
		let x = document.getElementById('username-modal')
		x.classList.add("hide-modal");
		setTimeout(function() {
			x.classList.remove("show-modal");
			x.classList.remove("hide-modal");
		}, 500);
	}
	
	if(document.getElementById('privacy-modal')) {
		let x = document.getElementById('privacy-modal')
		x.classList.add("hide-modal");
		setTimeout(function() {
			x.classList.remove("show-modal");
			x.classList.remove("hide-modal");
		}, 500);
	}
	
	if(document.getElementById('about-modal')) {
		let x = document.getElementById('about-modal')
		x.classList.add("hide-modal");
		setTimeout(function() {
			x.classList.remove("show-modal");
			x.classList.remove("hide-modal");
		}, 500);
	}
	
	setTimeout(function() {
		a.style.display = "none";
	}, 500);
}

function switchInterface(id) {
	let user = document.getElementById(id);
	
	let chatHeader = document.getElementById('chat-header');
	chatHeader.innerHTML = user.innerHTML;
	
	let users = document.getElementsByClassName('user');
	let i = 0;
	while(i < users.length) {
		users[i].style.background = "none";
		++i;
	}
	
	user.style.background = "#121212";
	user.style.color = "#808080";
	
	let messages = 'messages' + id.slice(4)
	messages = document.getElementById(messages);
	let allMessages = document.getElementsByClassName('messages');
	i = 0;
	while(i < allMessages.length) {
		allMessages[i].style.display = "none";
		++i;
	}
	
	messages.style.display = "block";

	if(window.innerWidth <= 600) {
		document.getElementById('users').style.display = 'none';
		document.getElementById('chat').style.display = 'block';
		document.getElementById('back').style.display = 'inline';
	}
	document.getElementById('chat-box').focus();
}

function setIndex() {
	var headerHeight = document.getElementById('header').offsetHeight;
	var chatInterfaceHeaderHeight = document.getElementById('chat-header').offsetHeight;

	var chatInterfaceHeight = window.innerHeight - headerHeight - chatInterfaceHeaderHeight - 25 - 25 - 6;
	if(window.innerWidth <= 600) {
		chatInterfaceHeight = window.innerHeight - headerHeight - 6;
	}
	document.documentElement.style.setProperty('--cih', `${chatInterfaceHeight}px`);

	var chatFooterHeight = document.getElementById('chat-footer').offsetHeight;

	var messagesHeight = chatInterfaceHeight - chatFooterHeight - 4;
	if(window.innerWidth <= 600) {
		messagesHeight -= 25 + 25 + 12;
	}
	document.documentElement.style.setProperty('--mh', `${messagesHeight}px`);
	calcMessages = Math.round(messagesHeight);

	window.addEventListener("resize", setIndex);

	setTimeout(function() {
		document.getElementById('username').focus();
	}, 500);
}

function toggleMenu (){
	let x = document.getElementById('menu');
	let y = document.getElementById('nav');
	let z = document.getElementById('menu-background');

	if(i%2 == 0) {
		x.classList.add('rotate-menu');
		y.classList.add('show-nav');
		z.style.display = "block";
	}
	else {
		x.classList.add('rotate-menu-again');
		y.classList.add('hide-nav');

		setTimeout(function() {
			x.classList.remove('rotate-menu');
			x.classList.remove('rotate-menu-again');
			y.classList.remove('show-nav');
			y.classList.remove('hide-nav');
			z.style.display = "none";
		}, 500);
	}

	++i;
}

function sendMessage() {
	if(typeof savedUsername === "undefined") {
		openUsername();
		return;
	}

	var message = document.getElementById('chat-box');
	
	if(selectedUser === "everyone") {
		let temp = {};
		temp[savedUsername] = message.value.trim();
		socket.emit('broadcast', temp);
		
		if(message.value.trim() != '') {
			let flag = false;
			let messages = document.getElementById('messages-everyone');
			if(messages.scrollTop === messages.scrollHeight-calcMessages)
				flag = true;
			messages.innerHTML = messages.innerHTML + '<div style="width: 100%; text-align: right;"><div class="message" style="background: #fff; color: #000;">' + message.value.trim() + '</div></div>';
			if(flag)
				messages.scrollTop = messages.scrollHeight;
		}
	}
	else {
		let temp = {};
		temp[selectedUser] = message.value.trim();
		socket.emit('private', temp);
		
		if(message.value.trim() != '') {
			let flag = false;
			let messages = 'messages-' + selectedUser;
			messages = document.getElementById(messages);
			if(messages.scrollTop === messages.scrollHeight-calcMessages)
				flag = true;
			messages.innerHTML = messages.innerHTML + '<div style="width: 100%; text-align: right;"><div class="message" style="background: #fff; color: #000;">' + message.value.trim() + '</div></div>';
			if(flag)
				messages.scrollTop = messages.scrollHeight;
		}
	}

	message.value = '';
	document.getElementById('chat-box').focus();
}

function enterSend(e) {
	if(e.keyCode == 13)
		sendMessage();
}

socket.on('private', (data) => {
	let id = Object.keys(data)[0];
	let user = 'user-' + id;
	let flag = false;
	user = document.getElementById(user);
	let messages = 'messages-' + id;
	messages = document.getElementById(messages);
	
	if(messages.scrollTop === messages.scrollHeight-calcMessages)
		flag = true;
	
	let message = data[id];
	
	messages.innerHTML += '<div style="width: 100%; text-align: left;"><div class="message" style="background: #000; color: #fff;">' + message + '</div></div>';
	if(flag)
		messages.scrollTop = messages.scrollHeight;
	if(selectedUser != id)
		user.style.color = "#fff";
});

socket.on('broadcast', (data) => {
	let flag = false;
	let user = Object.keys(data)[0];
	let messages = document.getElementById('messages-everyone');
	let message = data[Object.keys(data)[0]];
	if(messages.scrollTop === messages.scrollHeight-calcMessages)
		flag = true;
	messages.innerHTML += '<div style="width: 100%; text-align: left;"><div class="message" style="background: #000; color: #fff;"><b>' + user + '</b>: ' + message + '</div></div>';
	if(flag)
		messages.scrollTop = messages.scrollHeight;
	
	if(selectedUser != "everyone")
		document.getElementById('user-everyone').style.color = "#fff";
});

function newUser() {
	let username = document.getElementById('username');
	
	if(username.value.trim() == '')
		return;
	else {
		socket.emit('new user', username.value.trim());
		closeAll();
		savedUsername = username.value.trim();
	}

	document.getElementById('chat-box').focus();
}

function enterUser(e) {
	if(e.keyCode == 13)
		newUser();
}

socket.on('new user', (user) => {
	let users = document.getElementById('user-list');
	
	let temp = 'user-' + Object.keys(user)[0];
	if(document.getElementById(temp)) {
		document.getElementById(temp).innerHTML = '@' + user[Object.keys(user)[0]];
		if(selectedUser == Object.keys(user)[0])
			document.getElementById('chat-header').innerHTML = '@' + user[Object.keys(user)[0]];
	}
	else {
		users.innerHTML += '<div id="user-' + Object.keys(user)[0] + '" class="user" style="background: none; color: #808080;" onclick="switchInterface(this.id); selectedUser = this.id.slice(5);">@' + user[Object.keys(user)[0]] + '</div>';
		let chat = document.getElementById('chat');
		chat.innerHTML = '<div id="messages-' + Object.keys(user)[0] + '" class="messages" style="display: none;"></div>' + chat.innerHTML;
	}
});

socket.on('online users', (onlineUsers) => {
	let i = 0;
	while(i < Object.keys(onlineUsers).length) {
		let users = document.getElementById('user-list');
		users.innerHTML += '<div id="user-' + Object.keys(onlineUsers)[i] + '" class="user" style="background: none; color: #808080;" onclick="switchInterface(this.id); selectedUser = this.id.slice(5);">@' + onlineUsers[Object.keys(onlineUsers)[i]] + '</div>';
		let chat = document.getElementById('chat');
		chat.innerHTML = '<div id="messages-' + Object.keys(onlineUsers)[i] + '" class="messages" style="display: none;"></div>' + chat.innerHTML;
		++i;
	}
});

socket.on('delete user', (id) => {
	let user = 'user-' + id;
	user = document.getElementById(user);
	let messages = 'messages-' + id;
	messages = document.getElementById(messages);
	
	if(selectedUser == id) {
		messages.style.display = "none";
		document.getElementById('messages-everyone').style.display = "block";
		selectedUser = "everyone";
	}
	
	user.remove();
	messages.remove();
});

function goBack() {
	document.getElementById('users').style.display = 'block';
	document.getElementById('chat').style.display = 'none';
	document.getElementById('back').style.display = 'none';
}