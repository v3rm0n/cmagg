var fork = require('child_process').fork;

var processes = {};

var streamSpotify = function (id, req, res) {
  console.log('Forking new spotify process');
  var user = 'maidokaara';
  var password = '-';

  var forkSpotifyProcess = function () {

    var spotify = fork(__dirname + '/spotify-process.js', [id, user, password]);

    processes[user] = spotify;

    spotify.on('message', function (message) {
      if (message.message === 'data') {
        res.write(new Buffer(message.data));
      }
    });

    spotify.on('exit', function () {
      delete processes[user];
      res.end();
    });

    req.on('close', function () {
      spotify.send({message: 'close'});
    });
  };

  if (processes[user]) {
    console.log('We already have a process for user ' + user);
    processes[user].on('exit', forkSpotifyProcess);
    processes[user].send({message: 'close'});
  } else {
    console.log('No existing process for user ' + user);
    forkSpotifyProcess();
  }

};

var handler = function (req, res) {
  res.status(200).set({'Content-Type': 'audio/mpeg', 'Transfer-Encoding': 'chunked'});
  streamSpotify(req.params.id, req, res);
};

module.exports = handler;
