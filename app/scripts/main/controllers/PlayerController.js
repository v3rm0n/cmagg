'use strict';

angular.module('cmagg').controller('PlayerController', function ($scope, Playlist, PlayerService, $routeParams) {

  $scope.playlist = new Playlist($routeParams.id);

  $scope.items = $scope.playlist.getItems();

  $scope.player = new PlayerService($routeParams.id, $scope.items);

});
