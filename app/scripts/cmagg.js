'use strict';

angular.module('cmagg', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'firebase', 'ngResource', 'ngRoute', 'uuid4'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainController'
      })
      .when('/player/:id', {
        templateUrl: 'partials/player.html',
        controller: 'PlayerController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
