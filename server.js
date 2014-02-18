var mongoose = require('mongoose');
var queue = require('./queue');
var db = require('./db');

module.exports.jobs = queue.create();
module.exports.schema = db.schema;