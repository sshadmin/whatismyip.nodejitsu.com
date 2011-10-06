var util = require("util"),
    http = require("http"),
    ejs = require("ejs"),
    static = require("node-static"),
    fs = require("fs"),
    winston = require("winston");

var getIp = function (req) {
  return {
    ip: ( req.headers["X-Forwarded-For"]
      || req.headers["x-forwarded-for"]
      || req.client.remoteAddress )
  };
};

http.createServer(function (req, res) {

  // I bet there's a reasonable way to guess what these should be based on name or mimetype or something. Probably node-static uses it.
  var routes = {
    "/": {
      template: "/templates/index.html",
      head: {
        "Content-Type": "text/html"
      }
    },

    "/index.html": {
      template: "/templates/index.html",
      head: {
        "Content-Type": "text/html"
      }
    },

    "/index.json": {
      template: "/templates/index.json",
      head: {
        "Content-Type": "application/json"
      }
    },

    "/index.txt": {
      template: "/templates/index.txt",
      head: {
        "Content-Type": "text/plain"
      }
    }
  }

  var handled = Object.keys(routes).some(function(route) {
    if (req.url === route) {
      var ip = getIp(req);
      fs.readFile(__dirname + routes[route].template, function (err, template) {
        if (err) {
          winston.error(JSON.stringify(err, true, 2));
          res.writeHead(200, {"Content-Type": "text/plain"});
          res.end("Whups! Something went wrong.");
        }
        res.writeHead(200, routes[route].head);
        res.end(ejs.render(template.toString(), { locals: ip }));
      });

      return true;
    } else {
      return false;
    }
  });
  
  if (!handled) {
    winston.info("serving static file "+__dirname+"/static"+req.url);
    var server = new static.Server(__dirname+"/static/");
    req.on("end", function () {
      server.serve(req, res);
    });
  }

}).listen(8000);
