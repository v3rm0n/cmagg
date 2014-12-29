/* global Playem, YoutubePlayer, SoundCloudPlayer, VimeoPlayer  */

'use strict';

var app = angular.module('cmagg');

app.factory('playerService', ['$window', '$rootScope', function ($window, $rootScope) {

  $window.SOUNDCLOUD_CLIENT_ID = '18045be62973fcaed72ba23eedeec3e8';

  var getPlayer = function (id) {
    return $window.document.getElementById(id);
  };

  var createPlayer = function (id) {
    var tag = $window.document.createElement('div');
    tag.id = id;
    $window.document.body.appendChild(tag);
  };

  createPlayer('player');
  createPlayer('viplayer');

  //Recreate youtube player element every time it's removed from DOM
  $rootScope.$watch(getPlayer, function (newValue) {
    if (!newValue) {
      createPlayer('player');
    }
  });

  var defaultParams = {
    playerId: 'player',
    origin: $window.location.host || $window.location.hostname,
    playerContainer: getPlayer('player')
  };

  var playem = new Playem();
  playem.addPlayer(YoutubePlayer, defaultParams);
  playem.addPlayer(SoundCloudPlayer, defaultParams);
  playem.addPlayer(VimeoPlayer, {
    playerContainer: getPlayer('viplayer')
  });

  return playem;
}]);

app.factory('metadataService', ['$window', 'playerService', '$q', function ($window, playerService, $q) {

  return {
    fetch: function (url) {
      var d = $q.defer();
      var found = playerService.getPlayers().some(function (player) {
        if (player.getEid(url)) {
          player.fetchMetadata(url, function (metadata) {
            if (!metadata) {
              d.reject();
            } else {
              metadata.label = player.label;
              d.resolve(metadata);
            }
          });
          return true;
        }
        return false;
      });
      if (!found) {
        d.reject();
      }
      return d.promise;
    }
  };
}]);
