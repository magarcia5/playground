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

/*
	Buffer concepts
	http://www.tutorialspoint.com/nodejs/nodejs_buffers.htm
*/

buf = new Buffer(256);
len = buf.write("Simply Easy Learning");

console.log("Octets written : "+  len);

/*
	Streams
*/

var readerStream = fs.createReadStream('fgl.txt'),
	data         = '';

readerStream.setEncoding('UTF8');

readerStream.on('data', function(chunk) {
	// assuming the data won't come in at once
	data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

// Pipe stream
var rs = fs.createReadStream('fgl.txt'),
	ws = fs.createWriteStream('fgl-out.txt');

// Pipe the read and write operations
// read input.txt and write data to output.txt
rs.pipe(ws);
