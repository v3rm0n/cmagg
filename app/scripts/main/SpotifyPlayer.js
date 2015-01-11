/* global AudioFilePlayer, loader */

'use strict';

function SpotifyPlayer() {
  var player = SpotifyPlayer.super_.apply(this, arguments);
  this.label = 'Spotify';
  return player;
}

SpotifyPlayer.prototype = AudioFilePlayer.prototype;
SpotifyPlayer.super_ = AudioFilePlayer;

SpotifyPlayer.prototype.getEid = function (url) {
  return /spotify.com\/track\/(\w+)/.test(url) ? RegExp.$1 : null;
};

SpotifyPlayer.prototype.fetchMetadata = function (url, cb) {
  var id = this.getEid(url);
  loader.loadJSON('https://api.spotify.com/v1/tracks/' + id, function (data) {
    cb({
      title: data.name,
      img: data.album.images[0]
    });
  });
};

SpotifyPlayer.prototype.play = function (id) {
  var url = '/spotify/' + id;
  if (this.isReady) {
    this.embed({trackId: url});
  }
};
