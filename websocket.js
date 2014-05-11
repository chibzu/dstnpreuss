var WebSocketServer = require('ws').Server;
var users = {};
wss = new WebSocketServer({port:1337});
wss.broadcast = function(data) {
	for(var i in this.clients)
		this.clients[i].send(data);
};	
wss.on('connection', function(ws) {
		console.log("Opened Connection");
		for (user in users){
			ws.send(JSON.stringify({"action":"join", "data":user}));
		}
		ws.on('message', function(message){
			var msg = JSON.parse(message);
			if (msg.action === "chat") {
				console.log("received message, broadcasting");
				wss.broadcast(message);
			}
			else if (msg.action === "join") {
				console.log("user join");
				users[msg.data] = true;
				wss.broadcast(message);
			}
			else if (msg.action === "leave") {
				console.log("user leave");
				delete users[msg.data];
				wss.broadcast(message);
			}	
		});
});
console.log("server started at 1337");
