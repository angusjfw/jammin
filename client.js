var socket = io();

var synth = new Tone.SimpleSynth().toMaster();

function playSound(tone) {
  synth.triggerAttackRelease(tone, "8n");
  console.log('trigger');
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

function playSong() {
  track = {
    1000: 'C4',
    2000: 'D4',
    3000: 'C4',
    5000: 'C4',

  };
  console.log('playingsong');

  play(track);
}

function play(track) {
  $.each(track, function(time,note) {
    console.log('begplayingnote');
    setTimeout(function(){
      playSound(note);
      console.log('playingnote');
    },time);

  });

}
