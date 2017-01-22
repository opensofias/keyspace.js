
"use strict";


var audio = new AudioContext ();
var globalGain = audio.createGain ();
globalGain.connect (audio.destination);

var settings =
{
  controls:
  {
    base_freq: document.getElementById("base_freq"),
    waveform: document.getElementById("waveform"),
    move_basekey: document.getElementById("move_basekey"),
    volume: document.getElementById("volume")
  },
  
  refresh: function()
  {
    this.base_freq = this.controls.base_freq.valueAsNumber;
    this.waveform = this.controls.waveform.value;
    this.move_basekey = this.controls.move_basekey.valueAsNumber;
    globalGain.gain.value = this.volume = this.controls.volume.valueAsNumber;
  },
  
  init: function () {
    var refresh = this.refresh.bind(settings);
    this.controls.base_freq.addEventListener("change", refresh);
    this.controls.waveform.addEventListener("change", refresh);
    this.controls.move_basekey.addEventListener("change", refresh);
    this.controls.volume.addEventListener("change", refresh);

	
    refresh();
  }
}

settings.init();



function Key (factor, element) {
  this.element = element;
  this.gain = audio.createGain ();
  this.gain.connect (globalGain);
  this.factor = factor;
  
  var press = this.keyPress.bind(this);
  var release = this.keyRelease.bind(this);
  
  this.element.addEventListener("touchstart", press, false);
  this.element.addEventListener("mousedown",  press, false);
  this.element.addEventListener("touchend",    release, false);
  this.element.addEventListener("touchcancel", release, false);
  this.element.addEventListener("mouseup",     release, false);
  this.element.onselectstart = function() {return false; };
  this.element.oncontextmenu = function(){ return false };
  
}

Key.prototype = {
  keyPress: function ()
  {
    this.osci = audio.createOscillator ();
    this.osci.frequency.value = settings.base_freq * this.factor;
    this.osci.connect(this.gain);
    console.log(settings.waveform);
    this.osci.type = settings.waveform;
    this.osci.start();
  },
  
  keyRelease: function ()
  {
    this.osci.stop();
    this.osci.disconnect();
  }
}

var basekey = new Key (1, document.getElementById("basekey"));
var blakey = new Key (2, document.getElementById("blakey"));

/*function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}
function drag_over(event) {
    event.preventDefault();
    return false;
}

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    basekey.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    basekey.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}
basekey.addEventListener('dragstart',drag_start,false);
document.body.addEventListener('dragover',drag_over,false);
document.body.addEventListener('drop',drop,false);
*/


function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}
function drag_over(event) {
    event.preventDefault();
    return false;
}

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    basekey.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    basekey.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}

basekey.addEventListener('dragstart',drag_start,false);
document.body.addEventListener('dragover',drag_over,false);
document.body.addEventListener('drop',drop,false);
