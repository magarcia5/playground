var express = require("express"),
	app = express();

app.use(express.static('static'));
app.get('/', function (req, res) {
	var options = {
		headers: {
			"Cache-Control": "no-cache, no-store, must-revalidate"
		}
	}
   res.sendFile( __dirname + "/" + "index.html", options);
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Blog app listening at http://%s:%s", host, port)

})