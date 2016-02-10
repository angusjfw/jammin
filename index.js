var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

var currentRecord = {};

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname));

http.listen(app.get('port'), function() {
  console.log('Node app is running on port' + app.get('port'));
});

app.get('/', function(request, response) {
  response.render('index');
});

io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('transmit note', function(tone) {
    console.log('server received note', tone);
    io.emit('play note', tone);
  });

  socket.on('transmit record', function(record) {
    console.log('server received record');
    currentRecord = record;
  });

  socket.on('get record', function() {
    socket.emit('receive record', currentRecord);
  });
});
