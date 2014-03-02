var express = require('express');
var app = express();
var sanitizer = require('sanitizer');
var jobs = require('./server').jobs;
var Game = require('./server').schema.Game;
var Gamer = require('./server').schema.Gamer;
var fs = require('fs');
var ejs = require('ejs');
var Q = require('q');

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());

var escape = function(input) {
  return sanitizer.escape(sanitizer.sanitize(input));
};

var readIndex = function() {
  return Q.nfcall(fs.readFile, 'index.html', 'utf-8');
};

var loadGames = function() {
  var deferred = Q.defer();
  Game.find({}).sort('+name').exec(function(err, games) {
    if (err) {
      deferred.reject(err);
    }
    deferred.resolve(games || []);
  });
  return deferred.promise;
};

var loadIndexPage = function() {
  return Q.all([readIndex(), loadGames()]);
};

app.get('/', function(req, res) {
  loadIndexPage().spread(function(indexHTML, games) {
    res.send(ejs.render(indexHTML, {games: JSON.stringify(games)}));
  });
});

app.get('/gamers', function(req, res) {
  Gamer.find({}).sort('-created').exec(function(err, gamers) {
    if (err) {
      console.log(err);
    }
    res.json(gamers);
  });
});

app.post('/gamers', function(req, res) {
  var gamerData = req.body.gamerData;
  var gamerTag = escape(gamerData.gamerTag);
  var games = gamerData.games.map(function(g){ return escape(g);});

  if (!gamerData.gamerTag) {
    res.json(400);
    return;
  }
  Gamer.findOne({gamerTag: gamerTag}, function(err, gamer) {
    if (err) {
      res.json(500);
      return;
    }
    var exists = !!gamer;
    gamer = gamer || new Gamer({
      gamerTag: gamerTag
    });
    gamer.created = Date.now();
    gamer.games = games;
    gamer.save(function(err, g) {
      if (exists) {
        res.json(200);
      } else {
        jobs.create('gamer', {
          gamerTag: gamerTag
        }).save();
        res.json(201, g);
      }
    });
  });
});


var port = Number(process.env.PORT) || 5000;
app.listen(port, function() {
  console.log('listening on port: ' + port);
});