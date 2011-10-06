var util = require("util"),
    http = require("http"),
    ejs = require("ejs"),
    static = require("node-static"),
    fs = require("fs");

var getIp = function (req) {
  return {
    ip: ( req.headers["X-Forwarded-For"]
      || req.headers["x-forwarded-for"]
      || req.client.remoteAddress )
  };
};

http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});

  if (req.url == "/") {
    var ip = getIp(req);
    console.log(ip);

    fs.readFile(__dirname+"/templates/index.html", function (err, template) {
      if (err) {
          throw err;
      }

      res.end(ejs.render(template.toString(), { locals: ip }));
    });
  } else {
    var server = new static.Server(__dirname+"/static/");
    server.serve(req, res);
  }

}).listen(8080);
