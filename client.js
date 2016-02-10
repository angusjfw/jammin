// stopwatch
StopWatch = function(){
};

StopWatch.prototype.startTime = function(){
    this.startMilliseconds = new Date().getTime();
    console.log("Recording started");
};

StopWatch.prototype.markTime = function(){
    return new Date().getTime() - this.startMilliseconds;
};

StopWatch.prototype.reset = function(){
  this.startMilliseconds = 0;
  this.elapsedMilliseconds = 0;
};

var stopWatch = new StopWatch();

//tone.js
var synth = new Tone.SimpleSynth().toMaster();

function playBack(tone) {
  synth.triggerAttackRelease(tone, "8n");
}

//recording
var record = {};
var recording = false;

function toggleRecording() {
  if (recording) {
    emitRecord(record);
    $('#recordButton').text('Start Recording');
    record = {};
    recording = false;
  }
  else {
    stopWatch.startTime();
    $('#recordButton').text('Stop Recording');
    recording = true;
  }
}

function recordNote(tone) {
  var elapsedTime = stopWatch.markTime();
  record[elapsedTime] = tone;
  console.log(record);
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
  playBack(tone);
  if (recording) { recordNote(tone); }
  $('#playing').text(tone);
  console.log('client played note');
});

function emitRecord() {
  socket.emit('transmit record', record);
}

function playRecording() {
  socket.emit('get record');
}

socket.on('receive record', function(record) {
  play(record);
});
