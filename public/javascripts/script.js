var scClientID = "aa013c00f4937a12f74be2dd01249848";

var session = new Object();
session.artistIndex = 0;
session.songIndex = 0;
session.artists = [];
session.songs = [];
session.username = "";
session.password = "";
session.similarArtists = [];
session.scSongs = [];
var artistSelected = false;

$(document).ready(function() {
	$('.hide').hide();

	console.log("START");

	// init soundcloud client
	SC.initialize({
		client_id: scClientID
	});

	$('#loginButton').on('click', login);
	$('#logoutButton').on('click', logout);
	$('#createUserButton').on('click', createUser);
	$('#deleteUserButton').on('click', deleteUser);
	$('#simArtistButton').on('click', similarArtistsViaButton);
	$('#newSongButton').on('click', newSong);
	$('#newArtistButton').on('click', newArtist);
	$('#saveSongButton').on('click', saveSong);
	$('#saveArtistButton').on('click', saveArtist);
	$('#songsBody').on('click', 'td a.playLinkSong', playLinkSong);
	$('#artistsBody').on('click', 'td a.playLinkArtist', playLinkArtist);
});

function searchSoundCloud(artist) {
	SC.get('/tracks', { 
		q: artist,
		limit: 30
	}, function(tracks) {
		console.log(artist);

		console.log(tracks);

		session.scSongs = [];		

		for (var i = 0; i < tracks.length; i++) {
			session.scSongs.push({"title": tracks[i].title, "uri": tracks[i].uri});
		}

		loadNewSong(session.scSongs[0].uri);
	});
}

function loadNewSong(soundURI) {

	console.log(soundURI);

	var widgetIframe = document.getElementById('sc-widget'),
	widget = SC.Widget(widgetIframe);

	widget.load(soundURI, {
		show_artwork: false,
		auto_play: true
	});

	widget.bind(SC.Widget.Events.FINISH, function() {
		session.songIndex++;
		loadNewSong(session.scSongs[session.songIndex].uri);
	});
}

function login() {
	if ($('#username').val() == "" || $('#password').val() == "") {
		alert("Fill in username and password fields!");
		return;
	}

	var username = $('#username').val();
	var password = $('#password').val();
	var sendData = {
		"username": username,
		"password": password
	};
	console.log(sendData);   

	$.ajax({
		type: 'POST',
		data: sendData,
		url: '/users/login'
	}).done(function(response) {
		console.log(response);

		if (response == "success") {
			session.username = username;
			session.password = password;

			getSongs();
			getArtists();

			$('.hide').show();
			$('.reverseHide').hide();
			alert("Successfully logged in!")
		} else {
			alert("Username and password combination is invalid.");
		}
	});
}

function logout() {
	$('.hide').hide();
	$('.reverseHide').show();
	artistSelect = false;
}

function createUser() {
	if ($('#username').val() == "" || $('#password').val() == "") {
		alert("Fill in username and password fields!");
		return;
	}

	var username = $('#username').val();
	var password = $('#password').val();
	var sendData = {
		"username": username,
		"password": password 
	};
	console.log(sendData); 

	$.ajax({
		type: 'POST',
		data: sendData,
		url: '/users/create'
	}).done(function(response) {
		console.log(response);

		alert(response);
	});
}

function deleteUser() {
	if ($('#username').val() == "" || $('#password').val() == "") {
		alert("Fill in username and password fields!");
		return;
	}

	var username = $('#username').val();
	var password = $('#password').val();
	var sendData = {
		"username": username,
		"password": password 
	};
	console.log(sendData); 

	$.ajax({
		type: 'DELETE',
		data: sendData,
		url: '/users/delete'
	}).done(function(response) {
		console.log(response);

		alert(response);
	});
}

function similarArtistsViaButton() {
	if ($('#artistInput').val() == "") {
		alert("Fill in artist field!");
		return;
	}
	similarArtists($('#artistInput').val(), false);
}

function similarArtists(artist, includeArtist) {
	$.ajax({
		type: 'GET',
		url: '/similarartists/' + encodeURIComponent(artist)
	}).done(function(similarArtists) {
		console.log(similarArtists);

		if (similarArtists == "failure") {
			alert("No matching artist.");
			return;
		}

		artistSelected = true;

		session.similarArtists = similarArtists;

		session.songIndex = 0;
		session.artistIndex = 0;

		if (includeArtist) {
			similarArtists.unshift(artist);
		}
		
		searchSoundCloud(session.similarArtists[0]);
	});
}

function newSong() {
	if (artistSelected) {
		session.songIndex++;
		loadNewSong(session.scSongs[session.songIndex].uri);
	} else {
		alert("Select an artist.");
	}
}

function newArtist() {
	if (artistSelected) {
		session.songIndex = 0;
		session.artistIndex++;
		searchSoundCloud(session.similarArtists[session.artistIndex]);
	} else {
		alert("Select an artist.");
	}
}

function updateArtists() {
	var username = session.username;
	var password = session.password;
	var artists = session.artists;
	var sendData = {
		"username": username,
		"password": password,
		"artists": JSON.stringify(artists)
	};
	console.log(sendData); 

	$.ajax({
		type: 'PUT',
		data: sendData,
		url: '/users/updateartists'
	}).done(function(response) {
		console.log(response);
	});	
}

function updateSongs() {
	var username = session.username;
	var password = session.password;
	var songs = session.songs;

	var sendData = {
		"username": username,
		"password": password,
		"songs": JSON.stringify(songs)
	};
	console.log(sendData);

	$.ajax({
		type: 'PUT',
		data: sendData,
		url: '/users/updatesongs'
	}).done(function(response) {
		console.log(response);
	});
}

function getArtists() {
	var username = session.username;
	var password = session.password;
	var sendData = {
		"username": username,
		"password": password
	};
	console.log(sendData);

	$.ajax({
		type: 'GET',
		data: sendData,
		url: '/users/getartists'
	}).done(function(response) {
		if (response != "") {
			console.log(JSON.parse(response));
			session.artists = JSON.parse(response);

			populateMyArtists();
		}
	});
}

function getSongs() {
	var username = session.username;
	var password = session.password;
	var sendData = {
		"username": username,
		"password": password
	};
	console.log(sendData);

	$.ajax({
		type: 'GET',
		data: sendData,
		url: '/users/getsongs'
	}).done(function(response) {
		if (response != "") {
			console.log(JSON.parse(response));
			session.songs = JSON.parse(response);

			populateMySongs();
		}
	});
}

function saveSong() {
	if (artistSelected) {
		session.songs.push({"title": session.scSongs[session.songIndex].title,
						"uri": session.scSongs[session.songIndex].uri});
		updateSongs();
		populateMySongs();
	} else {
		alert("Select an artist.");
	}
}

function saveArtist() {
	if (artistSelected) {
		session.artists.push(session.similarArtists[session.artistIndex]);
		updateArtists();
		populateMyArtists();
	} else {
		alert("Select an artist.");
	}
}

function populateMyArtists() {
	var tableContent = '';
	for (var i = 0; i<session.artists.length; i++) {
		tableContent += '<tr>';
		tableContent += '<td><a href="#" class="playLinkArtist" rel="' 
						+ session.artists[i] + '">' + session.artists[i]  + '</a></td>';
		tableContent += '</tr>';
	}
	$('#artistsBody').html(tableContent);
}

function populateMySongs() {
	var tableContent = '';
	for (var i = 0; i<session.songs.length; i++) {
		tableContent += '<tr>';
		tableContent += '<td><a href="#" class="playLinkSong" rel="' 
						+ session.songs[i].uri + '">' + session.songs[i].title + '</a></td>';
		tableContent += '</tr>';
	}
	$('#songsBody').html(tableContent);
}

function playLinkSong(event) {
    event.preventDefault();
    loadNewSong($(this).attr('rel'));
}

function playLinkArtist(event) {
    event.preventDefault();
   	similarArtists($(this).attr('rel'), true);
}