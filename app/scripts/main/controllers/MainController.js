'use strict';

angular.module('cmagg').controller('MainController', function ($scope, Playlist, $location, players) {

  $scope.players = players;

  $scope.start = function () {
    new Playlist().$loaded().then(function (playlist) {
      $location.path('/playlist/' + playlist.$id);
    });
  };

});
