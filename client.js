// stopwatch
StopWatch = function(){
};

StopWatch.prototype.startTime = function(){
    this.startMilliseconds = new Date().getTime();
    console.log("Recording started");
};

StopWatch.prototype.markTime = function(){
    return new Date().getTime() - s1.startMilliseconds;
};

StopWatch.prototype.reset = function(){
  this.startMilliseconds = 0;
  this.elapsedMilliseconds = 0;
};

var s1 = new StopWatch();

//tone.js
var synth = new Tone.SimpleSynth().toMaster();

function playBack(tone) {
  synth.triggerAttackRelease(tone, "8n");
}

//recording
var recording = {};

function playRecord(tone) {
  playBack(tone);
  var elapsedTime = s1.markTime();
  recording[elapsedTime] = tone;
  console.log(recording);
}

function playSong() {
  play(recording);
}

function play(track) {
  $.each(track, function(time,note) {
    console.log('begplayingnote');
    setTimeout(function(){
      playBack(note);
      console.log('playingnote');
    },time);
  });
}

// websockets
var socket = io();

function emitSound(tone) {
  socket.emit('transmit note', tone);
  console.log('client transmitting note');
}

socket.on('play note', function(tone) {
  playRecord(tone);
  $('#playing').text(tone);
  console.log('client played note');
});
