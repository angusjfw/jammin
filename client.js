var socket = io();

var synth = new Tone.SimpleSynth().toMaster();
var polySynth = new Tone.PolySynth(4, Tone.MonoSynth).toMaster();

function playSound(tone) {
  synth.triggerAttackRelease(tone + "4", "8n");
}

function polyChord() {
  polySynth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n");
}

function emitSound(tone) {
  socket.emit('transmit note', tone);
  console.log('client transmitting note');
}

socket.on('play note', function(tone) {
  playSound(tone);
  console.log('client played note');
});
