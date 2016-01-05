var finalhandler = require('finalhandler');
var http = require('http')
var serveStatic = require('serve-static');
var io = require('socket.io');
var fs = require('fs');
var jf = require('jsonfile');

function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}


function BTDev(port) {
	this.dumps = [];
	this.loadDumps();

	var serve = serveStatic('public');
	this.server = http.createServer(function(req, res) {
		var done = finalhandler(req, res);
		serve(req, res, done);
	});

	this.initIO();

	this.server.listen(port);
}

BTDev.prototype.loadDumps = function() {
	var self = this;

	fs.readdir('logs', function(err, files) {
		if (err) throw err;

		files.forEach(function(file) {
			if (file.indexOf('.json') == -1) {
				return;
			}
			var index = parseInt(file.split('.')[0]);

			self.dumps[index] = jf.readFileSync('logs/' + file);
		});
	});
}

BTDev.prototype.initIO = function() {
	var self = this;

	self.io = io.listen(self.server);

	self.io.on('connection', function(socket) {
		socket.on('getDumps', function (data) {
			socket.emit('getDumps', self.dumps);
		});

		socket.on('sendRaw', function(data) {
			self.io.sockets.emit(data.event, data.data);
		});

		socket.on('setNick', function(data) {
			socket.emit('setNick', data.nick);
		});	

		socket.on('saveDump', function(data) {
			self.dumps[data.id] = data.dump;
			jf.writeFile('logs/' + pad(data.id, 7) + '.json', data.dump, function(err) {
				if (err) console.log(err);
			});
		});

		socket.on('deleteDump', function(data) {
			self.dumps.splice(data, 1);
			fs.unlink('logs/' + pad(data, 7) + '.json', function(err) {
				if (err) console.log(err);
			});
		});
	});
}

var server = new BTDev(8344);
