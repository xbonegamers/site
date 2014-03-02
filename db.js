var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/gamerfriends';

mongoose.connect(mongoUri);

var db = mongoose.connection;
var gamerSchema = mongoose.Schema({
  gamerTag: String,
  created: {type: Date, default: Date.now},
  xboxdata: Object,
  games: Array
});
var gameSchema = mongoose.Schema({
  name: String
});
var Gamer = mongoose.model('Gamer', gamerSchema);
var Game = mongoose.model('Game', gameSchema);

db.on('error', console.error.bind(console, 'db connection error'));
db.on('open', console.log.bind(console, 'db connection opened'));

module.exports.db = db;
module.exports.schema = {
  Game: Game,
  Gamer: Gamer
};