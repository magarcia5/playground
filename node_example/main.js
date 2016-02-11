/*
	Example from http://www.tutorialspoint.com/nodejs/nodejs_first_application.htm
*/

var http = require("http"),
	fs   = require("fs"),
	evts = require("events");

http.createServer(function(request, response){
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');

/*
	Callback concepts
*/
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

/* 
	Events concepts
*/

var eventEmitter = new evts.EventEmitter();

eventEmitter.on('connection', function(){
	console.log("Connection successful.");

	// fire event
	eventEmitter.emit('data_received');
});

eventEmitter.on('data_received', function(){
   console.log('data received succesfully.');
});

eventEmitter.emit('connection');

var listner1 = function listner1() {
   console.log('listner1 executed.');
}

var listner2 = function listner2() {
  console.log('listner2 executed.');
}

eventEmitter.addListener('connection', listner1);

eventEmitter.on('connection', listner2);

var eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

eventEmitter.emit('connection');

eventEmitter.removeListener('connection', listner1);
console.log("Listner1 will not listen now.");

eventEmitter.emit('connection');

eventListeners = require('events').EventEmitter.listenerCount(eventEmitter,'connection');
console.log(eventListeners + " Listner(s) listening to connection event");

