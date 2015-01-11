var express = require('express');
var app = express();

app.use(express.static('dist'));

app.get('/spotify/:id', require('./lib/spotify-handler'));

app.listen(3000);

console.log('Server is listening on port 3000');
