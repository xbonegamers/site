var app = angular.module('app', ['btford.modal']);

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

app.factory('games', ['$window', function($window) {
  return $window.initialData.games.map(function(g) {
    return g.name;
  });
}]);

app.factory('myModal', ['btfModal', function (btfModal) {
  return btfModal({
    controller: 'AddMeCtrl',
    controllerAs: 'modal',
    templateUrl: 'add-me-modal.ng'
  });
}]).controller('AddMeCtrl', ['$http', 'myModal', 'games', function ($http, myModal, games) {
  this.closeMe = myModal.deactivate;
  this.games = games;
  this.gamerTag = '';
  this.games = games.map(function(g){ return {label: g, selected: false};});


  this.add = function() {
    var selectedGames = this.games.filter(function(g) {
      return g.selected;
    }).map(function(g) {
      return g.label;
    });
    var data = {
      gamerTag: this.gamerTag,
      games: selectedGames
    };
    $http.post('/gamers', {gamerData: data}).success(function(gamer, status) {
      myModal.deactivate();
    });
  }.bind(this);
}]);

app.controller('GamersCtrl', ['$scope', '$http', 'myModal', 'games',
  function($scope, $http, myModal, games) {
  this.showModal = myModal.activate;
  this.gamerSets = [];
  this.games = games.map(function(g){ return {label: g, selected: false};});

  var gameToGamers = {};
  var gamerTagToGamer = {};
  var nonFilteredGamers = [];

  $scope.$watch(function() {
    return myModal.active();
  }, function(newVal, oldVal) {
    if (!newVal && oldVal) {
      refresh();
    }
  });

  var refresh = function() {    
    $http.get('/gamers').success(function(gamers) {
      gamers.forEach(function(gamer) {
        gamerTagToGamer[gamer.gamerTag] = gamer;
        (gamer.games || []).forEach(function(game) {
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