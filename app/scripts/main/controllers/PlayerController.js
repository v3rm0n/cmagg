'use strict';

angular.module('cmagg').controller('PlayerController', function ($scope, Playlist, PlayerService, $routeParams) {

  $scope.playlist = new Playlist($routeParams.id);

  var playerService = new PlayerService($routeParams.id);

  $scope.player = playerService;

  $scope.items = $scope.playlist.getItems();

  $scope.items.onRemove(function (key) {
    if (playerService.isCurrent(key)) {
      playerService.stop();
    }
  });

  $scope.play = function (track) {
    playerService.play(track || $scope.items[0]);
  };

  $scope.pause = function () {
    playerService.toggle();
  };

  $scope.stop = function () {
    playerService.stop();
  };

});
