/* global Playem, YoutubePlayer, SoundCloudPlayer, VimeoPlayer  */

'use strict';

var app = angular.module('cmagg');

app.run(['$window', function ($window) {
  $window.SOUNDCLOUD_CLIENT_ID = '18045be62973fcaed72ba23eedeec3e8';
}]);

app.value('players', [YoutubePlayer, SoundCloudPlayer, VimeoPlayer]);

app.factory('PlayemPlayer', ['Player', '$q', '$window', 'players', function (Player, $q, $window, players) {

  var params = {
    origin: $window.location.host || $window.location.hostname,
    playerContainer: $window.document.getElementById('player')
  };

  var playem = new Playem();

  players.forEach(function (player) {
    playem.addPlayer(player, params);
  });

  return function (id, items) {
    var player = new Player(id);

    var findTrack = function (id) {
      return playem.getQueue().findIndex(function (added) {
        return added.metadata.id === id;
      });
    };

    var play = function (track) {
      var i = findTrack(track.id);
      if (i !== -1) {
        playem.stop();
        playem.play(i);
      }
    };

    var playing = player.currentTrack ? player.currentTrack.id : null;
    var playemState = 'stopped';

    player.$watch(function () {
      if (player.paused && playing && playemState !== 'paused') {
        console.log('pause');
        playem.pause();
        playemState = 'paused';
      } else if (!player.currentTrack) {
        playem.stop();
        playemState = 'stopped';
      }
      else if (!player.paused && !player.isCurrent(playing)) {
        console.log('play');
        playing = player.currentTrack.id;
        play(player.currentTrack);
        playemState = 'playing';
      } else if (playemState === 'paused' && !player.paused) {
        console.log('resume');
        playem.resume();
        playemState = 'playing';
      }
    });

    var initPlayem = function (items) {
      console.log('initlist');
      var d = $q.defer();
      items.$loaded().then(function () {
        playem.clearQueue();
        items.forEach(function (item) {
          playem.addTrackByUrl(item.url, {id: item.$id});
        });
        d.resolve();
      });
      return d.promise;
    };

    initPlayem(items);

    items.$watch(function () {
      initPlayem(items).then(function () {
        if (player.currentTrack) {
          var i = findTrack(player.currentTrack.id);
          if (i === -1) {
            player.stop();
          }
        }
      });
    });

    playem.on('onTrackChange', function (track) {
      console.log('track changed');
      items.$loaded().then(function () {
        var i = items.findIndex(function (it) {
          return it.$id == track.metadata.id;
        });
        playing = track.metadata.id;
        player.setCurrent(items[i]);
      });
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
