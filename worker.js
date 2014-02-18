var mongoose = require('mongoose');
var rest = require('restler');
var jobs = require('./server').jobs;
var Gamer = require('./server').schema.Gamer;
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