'use strict';

angular.module('cmagg').controller('PlayerController', function ($scope, Playlist, playerService, $routeParams) {

  var playlist = new Playlist($routeParams.id);

  playlist.$bindTo($scope, 'playlist');

  $scope.nameChangeable = false;

  $scope.changeName = function (nameChangeable) {
    $scope.nameChangeable = nameChangeable;
  };

  $scope.items = playlist.getItems();

  $scope.items.onRemove(function (key) {
    if ($scope.currentlyPlaying && $scope.currentlyPlaying.$id === key) {
      playerService.stop();
    }
  });

  $scope.add = function (url) {
    $scope.items.add({url: url}).catch(function () {
      alert('URL is not valid! Currently only youtube, soundcloud and vimeo are supported!');
    }).finally(function () {
      $scope.url = undefined;
    });
  };

  $scope.paused = false;

  playerService.on('onPause', function () {
    $scope.paused = true;
  });

  playerService.on('onTrackInfo', function (trackInfo) {
    $scope.trackInfo = trackInfo;
  });

  $scope.play = function (track) {
    var newTrack = track || $scope.items[0];
    playerService.clearQueue();
    playerService.addTrackByUrl(newTrack.url);
    $scope.currentlyPlaying = newTrack;
    playerService.play(0);
  };

  $scope.pause = function () {
    if ($scope.paused) {
      playerService.resume();
      $scope.paused = false;
    } else {
      playerService.pause();
    }
  };

  $scope.next = function () {
    var current = $scope.items.indexOf($scope.currentlyPlaying);
    $scope.play($scope.items[current + 1 % $scope.items.length]);
  };

  $scope.previous = function () {
    var current = $scope.items.indexOf($scope.currentlyPlaying);
    $scope.play($scope.items[Math.abs(current - 1 % $scope.items.length)]);
  };

  $scope.stop = function () {
    playerService.stop();
    $scope.currentlyPlaying = undefined;
  };

});
