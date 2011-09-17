var util = require("util"),
    http = require("http");

http.createServer(function (req, res) {
    var headers = JSON.stringify(req.headers, true);
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Client Remote Address: "+req.client.remoteAddress+'\n');
    res.write("HTTP Header X-Forwarded-For: "+headers["X-Forwarded-For"]+'\n');
    res.end("Connection Remote Address: "+req.connection.remoteAddress);
}).listen(1337);
