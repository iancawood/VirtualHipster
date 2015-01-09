var express = require('express'),
	router = express.Router(),
	path = require('path'),
    http = require('http');

var scClientID = "aa013c00f4937a12f74be2dd01249848";
var scClientSecret = "eb019c7f5faabcc5a16a4abc079ea766";

var lastfmApiKey = "aff4c864e11713dd23a6c7b8fdc1fd73";
var lastfmSecret = "a652453a3e12395ef47cebc5df2af1b3";
var lastfmRoot = "http://ws.audioscrobbler.com/2.0/";

router.get('/',function(req,res){
	res.sendFile(path.resolve(__dirname + '/../views/lab4.html'));
});

// given an artist, this returns an array of similar artists
router.get('/similarartists/:artist', function(req, response) {
	var artist = encodeURIComponent(req.param('artist'));
	var limit = 30;

	var options = {
		host:'ws.audioscrobbler.com',
		path:'/2.0/?method=artist.getsimilar&artist=' + artist + '&api_key=' + lastfmApiKey + '&format=json&limit=' + limit,
		method:'GET'
	};

	var req = http.request(options, function(res){
		res.setEncoding('utf8');
		var data = '';

		res.on('data', function(chunk){
			data += chunk;
		});

		res.on('end', function(){
			data = JSON.parse(data);

			if (data.similarartists) {
				var simArtists = [];
				for (var i = 0; i<data.similarartists.artist.length; i++) {
					simArtists.push(data.similarartists.artist[i].name);
				}
				response.send(simArtists);
			} else {
				response.send("failure");
			}
		});
	});

	req.end();	
});

module.exports = router;