/* global Firebase */

'use strict';

angular.module('cmagg')
  .controller('MainCtrl', function ($scope, $firebase) {
  	// now we can use $firebase to synchronize data between clients and the server!
    var ref = new Firebase('https://<your-firebase>.firebaseio.com/');
    var sync = $firebase(ref);
  });
