var http = require('http');
var fs = require('fs');
var shell = require("child_process");
var util = require("util");


var server = http.createServer(function (request, response) {
		
		var ac_command = request.url.match(/\/remote\/(.*)/);
		if (ac_command && socket) {
			socket.send(ac_command[1]);
			response.writeHead(204);
			response.end();
			return;
		}



		console.log("Serving request to " + request.url);
		if (request.url === "/")
			request.url = "/index.html";
		else if (request.url === "/remote_control")
			request.url = "/media/controller.html";
		shell.exec("xdg-mime query filetype ." + request.url, function(err, stdout, stderr){
			response.writeHead(200, {'Content-Type': stdout});
			fs.readFile("."+request.url, function(err, data){response.end(data)});
		});			
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(80);
// Put a friendly message on the terminal
console.log("HTTP Server running at http://127.0.0.1:80/");

//websocket stuff
var wss = require('ws').Server;

wsServer = new wss({port:8008});
socket = null;
wsServer.on('connection', function(s) {
	console.log("Socket connected");
	socket = s;
	socket.on('message', function(message){
		console.log("received: " + message);
	});

	socket.on('close', function(){
		socket = null;
	});
});

console.log("websocket server running on 8008");





