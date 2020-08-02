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
}
