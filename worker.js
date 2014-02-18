var mongoose = require('mongoose');
var rest = require('restler');
var url = require('url');
var kue = require('kue');
var jobs;
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/gamerfriends';

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
      client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

jobs = kue.createKue();

mongoose.connect(mongoUri);

var db = mongoose.connection;
var gamerSchema = mongoose.Schema({
  gamerTag: String,
  created: {type: Date, default: Date.now},
  xboxdata: Object
});
var Gamer = mongoose.model('Gamer', gamerSchema);

db.on('error', console.error.bind(console, 'connection error'));

var baseProfileUrl = 'https://www.xboxleaders.com/api/profile.json?gamertag=';

var populateUser = function(gamerTag, done, xboxdata) {
  Gamer.findOne({gamerTag: gamerTag}, function(err, gamer) {
    gamer.xboxdata = xboxdata.data;
    gamer.save(function(err, gamer) {
      done(err);
    });
  });
};

var getProfileInformation = function(gamerTag, done) {
  rest.get(baseProfileUrl + gamerTag).
    on('success', populateUser.bind(this, gamerTag, done)).
    on('error', function(err, res) {
      console.log(err, res);
    });
};


jobs.process('gamer', function(job, done) {
  getProfileInformation(job.data.gamerTag, done);
});