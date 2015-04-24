var client = require('socket.io-client');
var jf = require('jsonfile');
var fs = require('fs');

function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

var dir = 'logs/' + Date.now() + '/';
fs.mkdirSync(dir);
var count = 0;

socket = client.connect('berrytube.tv:8344');

var emit = socket.$emit;
socket.$emit = function() {
	var event = arguments[0];
	var feed = arguments[1];

	var data = { event: event, data: feed };
	console.log(data);
	var file = dir + pad(count, 7) + '.json'; 
	jf.writeFile(file, data, function(err) {
		if (err) console.log(err);
	});
	count++;

	emit.apply(this, Array.prototype.slice.call(arguments));
}

socket.on('connect', function(data) {
	console.log('connect');
});
socket.on('disconnect', function(data) {
	console.log('disconnect');
});
