'use strict';

angular.module('cmagg', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'firebase', 'ngResource', 'ngRoute', 'uuid4', 'ngClipboard'])
  .config(['$routeProvider', 'ngClipProvider', function ($routeProvider, ngClipProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainController'
      })
      .when('/playlist/:id', {
        templateUrl: 'partials/playlist.html',
        controller: 'PlaylistController'
      })
      .when('/player/:id', {
        templateUrl: 'partials/player.html',
        controller: 'PlayerController'
      })
      .otherwise({
        redirectTo: '/'
      });
    ngClipProvider.setPath('bower_components/zeroclipboard/dist/ZeroClipboard.swf');
  }]);
