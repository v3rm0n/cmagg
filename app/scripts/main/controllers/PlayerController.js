'use strict';

angular.module('cmagg').controller('PlayerController', function ($scope, Playlist, PlayemPlayer, $routeParams) {

  $scope.playlist = new Playlist($routeParams.id);

  $scope.items = $scope.playlist.getItems();

  $scope.player = new PlayemPlayer($routeParams.id, $scope.items);

});
