var app = angular.module('app', []);

app.config(['$locationProvider', function($lp) {
  $lp.html5Mode(true);
}]);

app.filter('fromTime', ['$window', function($window) {
  return function(dateStr) {
    var moment = $window.moment;
    return (moment.parseZone(dateStr)).from(moment());
  };
}]);

app.filter('decode', ['$window', function($window) {
  return function(entity) {
    return $window.he.decode(entity);
  };
}]);

app.controller('GamersCtrl', ['$scope', '$http', function($scope, $http) {
  this.gamerSets = [];
  this.games = [{
    selected: false,
    label: 'Battlefield 4'
  }, {
    selected: false,
    label: 'Call of Duty: Ghosts'
  }, {
    selected: false,
    label: 'Need For Speed'
  }, {
    selected: false,
    label: 'Titanfall'
  }];
  this.gamerTag = '';

  var gameToGamers = {};
  var gamerTagToGamer = {};
  var nonFilteredGamers = [];

  var refresh = function() {    
    $http.get('/gamers').success(function(gamers) {
      gamers.forEach(function(gamer) {
        gamerTagToGamer[gamer.gamerTag] = gamer;
        gamer.games.forEach(function(game) {
          if (!gameToGamers[game]) {
            gameToGamers[game] = [];
          }
          gameToGamers[game].push(gamer);
        });
      });

      nonFilteredGamers = gamers;
      this.gamerSets = this.groupGamers(angular.copy(gamers));
    }.bind(this));
  }.bind(this);

  this.add = function() {
    $http.post('/gamers', {gamerTag: self.gamerTag}).success(function(gamer, status) {
      refresh();
    });
  };

  this.groupGamers = function(gamers) {
    var result = [];
    for (var i = 0; i < gamers.length; i += 3) {
      result.push(gamers.slice(i, i + 3));
    }
    return result;
  };

  $scope.$watch(function() {
    return this.games;
  }.bind(this), function() {
    var gamerTags = {};
    var noneSelected = true;
    this.games.forEach(function(game) {
      if (game.selected) {
        noneSelected = false;
        gameToGamers[game.label].forEach(function(gamer) {
          if (!gamerTags[gamer.gamerTag]) {
            gamerTags[gamer.gamerTag] = true;
          }
        });
      }
    });
    if (noneSelected) {
      this.gamerSets = this.groupGamers(nonFilteredGamers);
    } else {
      this.gamerSets = this.groupGamers(Object.keys(gamerTags).map(function(gamerTag) {
        return gamerTagToGamer[gamerTag];
      }));
    }
  }.bind(this), true);

  refresh();
}]);