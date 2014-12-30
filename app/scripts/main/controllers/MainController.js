'use strict';

angular.module('cmagg').controller('MainController', function ($scope, Playlist, $location) {

  $scope.start = function () {
    new Playlist().$loaded().then(function (playlist) {
      $location.path('/playlist/' + playlist.$id);
    });
  };

});
