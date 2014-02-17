var express = require('express');
var app = express();
var mongoose = require('mongoose');
var sanitizer = require('sanitizer');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';

mongoose.connect(mongoUri);

var db = mongoose.connection;
var gamerSchema = mongoose.Schema({
  gamerTag: String,
  created: {type: Date, default: Date.now}
});
var Gamer = mongoose.model('Gamer', gamerSchema);

db.on('error', console.error.bind(console, 'connection error'));
db.on('open', function() {
  
});

app.use(express.logger());
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res) {
  res.sendfile('index.html');
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
  var gamerTag = sanitizer.escape(sanitizer.sanitize(req.body.gamerTag));
  if (!gamerTag) {
    res.json(400);
    return;
  }
  Gamer.findOne({gamerTag: gamerTag}, function(err, gamer) {
    if (err) {
      res.json(500);
      return;
    }
    var exists = !!gamer;
    gamer = gamer || new Gamer({gamerTag: gamerTag});
    gamer.created = Date.now();
    gamer.gamerTag = gamerTag;
    gamer.save(function(err, g) {
      if (exists) {
        res.json(200);
      } else {
        res.json(201, g);
      }
    });
  });
});


var port = Number(process.env.PORT) || 5000;
app.listen(port, function() {
  console.log('listening on port: ' + port);
});