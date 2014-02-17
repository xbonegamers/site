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

app.controller('GamersCtrl', ['$http', function($http) {
  this.gamers = [];
  this.gamerTag = '';

  var self = this;
  var refresh = function() {    
    $http.get('/gamers').success(function(gamers) {
      self.gamers = gamers;
    });
  };

  this.add = function() {
    $http.post('/gamers', {gamerTag: self.gamerTag}).success(function(gamer, status) {
      refresh();
    });
  };
  refresh();
}]);