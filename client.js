var socket = io();

var synth = new Tone.SimpleSynth().toMaster();
var polySynth = new Tone.PolySynth(4, Tone.MonoSynth).toMaster();

function playSound(tone) {
  synth.triggerAttackRelease(tone, "8n");
}

function emitSound(tone) {
  socket.emit('transmit note', tone);
  console.log('client transmitting note');
}

socket.on('play note', function(tone) {
  playSound(tone);
  $('#playing').text(tone);
  console.log('client played note');
});
