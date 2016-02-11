
var synth = new Tone.PluckSynth().toMaster();

var setup = function() {
  Tone.Transport.bpm.value = 120;

  Tone.Transport.schedule(function(time){
     synth.triggerAttackRelease("C4", "8n");
   }, 1);
  Tone.Transport.scheduleRepeat(function(time){
    synth.triggerAttackRelease("D4", "8n");
  }, 2);
  Tone.Transport.scheduleOnce(function(time){
    synth.triggerAttackRelease("E4", "8n");
  }, 3);
  Tone.Transport.schedule(function(time){
    synth.triggerAttackRelease("F4", "8n");
  }, 5);
}();

function play() {
  Tone.Transport.start();
}

function stop(){
  Tone.Transport.stop();
}
