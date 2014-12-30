'use strict';

angular.module('cmagg').controller('PlaylistController', function ($scope, Playlist, Player, $routeParams, $window, $location) {

  var playlist = new Playlist($routeParams.id);
  playlist.$bindTo($scope, 'playlist');

  $scope.items = playlist.getItems();

  $scope.player = new Player($routeParams.id);

  $scope.nameChangeable = false;

  $scope.changeName = function (nameChangeable) {
    $scope.nameChangeable = nameChangeable;
  };

  $scope.add = function (url) {
    $scope.items.add({url: url}).catch(function () {
      $window.alert('URL is not valid! Currently only youtube, soundcloud and vimeo are supported!');
    }).finally(function () {
      $scope.url = undefined;
    });
  };

  $scope.link = $location.absUrl();

  $scope.share = function () {
    $window.alert('Link to the playlist has been copied to clipboard. Paste to share!');
  };

});
