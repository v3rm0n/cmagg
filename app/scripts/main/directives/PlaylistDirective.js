'use strict';

var app = angular.module('cmagg');

app.directive('cmaggPlaylist', [function () {
  return {
    templateUrl: 'partials/directives/playlist.html',
    restrict: 'E',
    scope: {
      player: '=',
      items: '='
    },
    link: function (scope) {

      var player = scope.player;

      scope.play = function (track) {
        player.play(track || scope.items[0]);
      };

    }
  };
}]);
