/* global Playem, YoutubePlayer, SoundCloudPlayer, VimeoPlayer  */

'use strict';

var app = angular.module('cmagg');

app.run(['$window', function ($window) {
  $window.SOUNDCLOUD_CLIENT_ID = '18045be62973fcaed72ba23eedeec3e8';
}]);

app.value('players', [YoutubePlayer, SoundCloudPlayer, VimeoPlayer]);

app.factory('Playem', ['$window', '$rootScope', 'players', function ($window, $rootScope, players) {

  return function () {

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

    var getParams = function (id) {
      return {
        origin: $window.location.host || $window.location.hostname,
        playerContainer: getPlayer(id)
      };
    };

    var playem = new Playem();
    players.forEach(function (player) {
      playem.addPlayer(player, getParams('player'));
      if (player === VimeoPlayer) {
        playem.addPlayer(player, getParams('viplayer'));
      }
    });

    return playem;
  };
}]);

//This connects playem with firebase player info
app.factory('PlayerService', ['Playem', 'Player', function (Playem, Player) {

  return function (id) {
    var playem = new Playem();
    var player = new Player(id);

    var play = function (track) {
      playem.clearQueue();
      playem.addTrackByUrl(track.url);
      playem.play(0);
    };

    var playemState = 'stopped';

    player.$watch(function () {
      if (!player.currentTrack && playemState !== 'stopped') {
        playem.stop();
        playemState = 'stopped';
      } else if (player.paused && playemState !== 'paused') {
        playem.pause();
        playemState = 'paused';
      } else if (player.currentTrack && playemState !== player.currentTrack.id) {
        play(player.currentTrack);
        playemState = player.currentTrack.id;
      } else if (player.currentTrack && playemState === 'paused') {
        playem.resume();
        playemState = player.currentTrack.id;
      }
    });

    return player;
  };
}]);

app.factory('metadataService', ['$window', 'players', '$q', function ($window, players, $q) {

  return {
    fetch: function (url) {
      var d = $q.defer();
      var found = players.some(function (player) {
        if (player.prototype.getEid(url)) {
          player.prototype.fetchMetadata(url, function (metadata) {
            if (!metadata) {
              d.reject();
            } else {
              metadata.label = player.name;
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
