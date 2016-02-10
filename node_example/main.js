/*
	Example from http://www.tutorialspoint.com/nodejs/nodejs_first_application.htm
*/

var http = require("http"),
	fs   = require("fs");

http.createServer(function(request, response){
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');

// Callback concepts
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

