"use strict";

var audio = new AudioContext ()
var globalGain = audio.createGain ()
globalGain.connect (audio.destination)

var settings =
{
	controls:
	{
		base_freq: document.getElementById("base_freq"),
		waveform: document.getElementById("waveform"),
		touch: document.getElementById("touch"),
		volume: document.getElementById("volume")
	},
	
	refresh: function ()
	{
		this.base_freq = this.controls.base_freq.valueAsNumber
		this.waveform = this.controls.waveform.value
		this.touch = this.controls.touch.valueAsNumber
		globalGain.gain.value = this.volume = this.controls.volume.valueAsNumber
	},
	
	init: function ()
	{
		var refresh = this.refresh.bind(settings);
		this.controls.base_freq.addEventListener("change", refresh);
		this.controls.waveform.addEventListener("change", refresh);
		this.controls.touch.addEventListener("change", refresh);
		this.controls.volume.addEventListener("change", refresh);

		refresh();
	},
	
}

settings.init();

class Key
{
	constructor (factor)
	{
		this.el = document.createElement ("div")
		this.el.classList.add ("key")
		factor === 1 && this.el.classList.add ("basekey")

		this.gain = audio.createGain ().connect (globalGain)
		this.factor = factor

		var press = this.press.bind(this)
		var release = this.release.bind(this)
		
		this.el.addEventListener("pointerdown", press, false)
		this.el.addEventListener("pointerup", release, false)
		this.el.addEventListener("pointerout", release, false)
		
		this.el.onselectstart = () => false
		this.el.oncontextmenu = () => false
	}

	press ()
	{
		this.osci = audio.createOscillator ()
		this.osci.frequency.value = settings.base_freq * this.factor
		this.osci.connect(this.gain)
		console.log(settings.waveform)
		this.osci.type = settings.waveform
		this.osci.start()
		this.el.classList.add ("pressed")
	}

	release ()
	{
		this.osci.stop(); this.osci.disconnect()
		this.el.classList.remove ("pressed")
	}
}

class KeyPad
{
	constructor (interval, fraction, keys)
	{
		this.el = document.createElement ("div")
		let count = 0
		do
		{
			const factor = Math.pow (interval, count / fraction)
			const key = new Key (factor)
			key.el.style.left = (count * 64) + "px"
			key.el.style.backgroundColor = hz2hsl(factor * settings.base_freq)
			this.el.appendChild (key.el)
		}
		while (count ++ < keys)
	}
}

var mod = (x, y = 1) => ((x % y) + y) % y

var hz2hsl = freq =>
{
	let lightness = Math.log(freq) / Math.log(440 * 64)
	let hue = mod (Math.log (freq / 27.5) / Math.LN2)
	return "hsl(" +
		Math.round(hue * 360) +
		",100%," +
		Math.round(lightness * 100) +
		"%)"
}

document.body.appendChild (new KeyPad (2,16,16).el)


