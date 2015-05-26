# Made with Framer
# by Benjamin den Boer
# www.framerjs.com

# Sketch Import
sketch = Framer.Importer.load "imported/music"

# Include the module
{AudioPlayer} = require "audio"
		
# Set-up
new BackgroundLayer
audio = new AudioPlayer audio: "audio.mp3", width: 80, height: 80

# Copy the frame (x,y, width, height) of the audioPlayer
# Customize play and pause buttons
audio.frame = sketch.play.frame
audio.controls.showPlay = -> @image = sketch.play.image
audio.controls.showPause = -> @image = sketch.pause.image

# Progress Bar
audio.showProgress = true

audio.progressBar.props = 
	width: 556, height: 14
	y: sketch.screen.maxY - 432
	backgroundColor: "e7e7e7"
	borderRadius: 0

audio.progressBar.fill.backgroundColor = "transparent"
audio.progressBar.centerX()

audio.progressBar.knob.props = 
	backgroundColor: "#FF2D55", 
	width: 3, height: 30
	borderRadius: 4
	
audio.showTime = true
audio.time.x = audio.progressBar.x - 56
audio.time.centerY(280)

audio.showTimeLeft = true
audio.timeLeft.x = audio.progressBar.maxX + 16
audio.timeLeft.centerY(278)

# Volume Bar
audio.showVolume = true
audio.volumeBar.props = 
	width: 540, height: 6
	y: sketch.screen.height - 117
	value: 0.75, knobSize: 35

audio.volumeBar.knob.style.boxShadow = "0 0 0 1px rgba(0,0,0,0.075), 0 3px 4px rgba(0,0,0,0.3)"
audio.volumeBar.centerX()