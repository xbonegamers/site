var url = require('url');
var kue = require('kue');
var redis = require('kue/node_modules/redis');

kue.redis.createClient = function() {
  var redisUrl = url.parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
      client.auth(redisUrl.auth.split(":")[1]);
  }
  return client;
};

module.exports.create = function() {
  return kue.createQueue();
};