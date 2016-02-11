// stopwatch

StopWatch = function(){
    this.reset();
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

// tone.js

var synth = new Tone.DrumSynth().toMaster();

var s1 = new StopWatch();
var recording = {};


function playSound(tone) {
  // kick.triggerAttack(60);
  synth.triggerAttackRelease(tone, "8n");
  var elapsedTime = s1.markTime();
  recording[elapsedTime] = tone;
  console.log(recording);
}

// websockets
var socket = io();

function emitSound(tone) {
  socket.emit('transmit note', tone);
  console.log('client transmitting note');
}

socket.on('play note', function(tone) {
  playSound(tone);
  $('#playing').text(tone);
  console.log('client played note');
});

function Kick(context) {
  this.context = context;
}

Kick.prototype.setup = function() {
  this.osc = this.context.createOscillator();
  this.gain = this.context.createGain();
  this.osc.connect(this.gain);
  this.gain.connect(this.context.destination);
};

Kick.prototype.trigger = function(time) {
  this.setup();

  this.osc.frequency.setValueAtTime(150, time);
  this.gain.gain.setValueAtTime(1, time);

  this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  this.osc.start(time);

  this.osc.stop(time + 0.5);
};

function Snare(context) {
  this.context = context;
}

Snare.prototype.setup = function() {
  this.noise = this.context.createBufferSource();
  this.noise.buffer = this.noiseBuffer();

  var noiseFilter = this.context.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  this.noise.connect(noiseFilter);

  this.noiseEnvelope = this.context.createGain();
  noiseFilter.connect(this.noiseEnvelope);

  this.noiseEnvelope.connect(this.context.destination);

  this.osc = this.context.createOscillator();
  this.osc.type = 'triangle';

  this.oscEnvelope = this.context.createGain();
  this.osc.connect(this.oscEnvelope);
  this.oscEnvelope.connect(this.context.destination);
};

Snare.prototype.noiseBuffer = function() {
  var bufferSize = this.context.sampleRate;
  var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
  var output = buffer.getChannelData(0);

  for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

Snare.prototype.trigger = function(time) {
  this.setup();

  this.noiseEnvelope.gain.setValueAtTime(1, time);
  this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  this.noise.start(time);

  this.osc.frequency.setValueAtTime(100, time);
  this.oscEnvelope.gain.setValueAtTime(0.7, time);
  this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  this.osc.start(time);

  this.osc.stop(time + 0.2);
  this.noise.stop(time + 0.2);
};

function HiHat(context, buffer) {
  this.context = context;
  this.buffer = buffer;
}

HiHat.prototype.setup = function() {
  this.source = this.context.createBufferSource();
  this.source.buffer = this.buffer;
  this.source.connect(this.context.destination);
};

HiHat.prototype.trigger = function(time) {
  this.setup();

  this.source.start(time);
};

var sampleLoader = function(url, context, callback) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      window.buffer = buffer;
      callback();
    });
  };

  request.send();
};


var context = new AudioContext();
var kick  = new Snare(context);


var setup = function() {
  var kick  = new Kick(context);
  var snare = new Snare(context);
  var hihat = new HiHat(context, window.buffer);

  Tone.Transport.bpm.value = 120;

  Tone.Transport.schedule(function(time){
     kick.trigger(time);
   }, 0.4);
  Tone.Transport.schedule(function(time){
     kick.trigger(time);
   }, 2);
  Tone.Transport.scheduleOnce(function(time){
     snare.trigger(time);
   }, 1);
  Tone.Transport.schedule(function(time){
     hihat.trigger(time);
   }, 1);

  $("#play").removeClass('pure-button-disabled');
}();

function playKick(time) {
  Tone.Transport.start();
}
