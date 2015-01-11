var stream = require('stream');
var lame = require('lame');
var nodeSpotify = require('node-spotify');

console.log('Started spotify process with id: ' + process.argv[2]);

var spotify = nodeSpotify({appkeyFile: './spotify_appkey.key'});

var trackStream = function (trackId) {

  console.log('Starting to stream ' + trackId);

  var encoder = new lame.Encoder({
    mode: lame.STEREO
  });

  encoder.on('data', function (chunk) {
    if (process.connected) {
      process.send({message: 'data', data: chunk});
    }
  })

  spotify.useNodejsAudio(function (err, buffer) {
    if (err) throw err;
    encoder.write(buffer);
    return true;
  });

  spotify.player.play(spotify.createFromLink('spotify:track:' + trackId));

  spotify.player.on({
    endOfTrack: function () {
      console.log('End of track');
      process.send({message: 'endOfTrack'});
      spotify.logout();
    }
  });
};

spotify.on({
  ready: function () {
    console.log('Spotify is ready');
    process.send({message: 'loggedIn', user: process.argv[3]});
    trackStream(process.argv[2]);
  },
  logout: function () {
    console.log('Logging out');
    process.send({message: 'loggedOut', user: process.argv[3]});
    process.exit();
  }
});

spotify.login(process.argv[3], process.argv[4], false, false);

process.on('message', function (data) {
  if (data.message === 'close') {
    console.log('Process closed');
    spotify.player.stop();
    spotify.logout();
  }
});
