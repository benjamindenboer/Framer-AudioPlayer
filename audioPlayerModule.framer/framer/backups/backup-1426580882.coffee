# Import Design from Sketch
sketch = Framer.Importer.load "imported/music"
{AudioPlayer} = require "audio"
		
new BackgroundLayer
audio = new AudioPlayer audio: "audio.mp3", width: 80, height: 80

# Copy the frame (x,y, width, height) of the audioPlayer
# Customize play and pause buttons
audio.frame = sketch.play.frame
audio.controls.showPlay = -> @image = sketch.play.image
audio.controls.showPause = -> @image = sketch.pause.image

# Progress Bar
audio.showProgress = true

audio.progressBar.properties = 
	width: 556, height:44
	y: sketch.screen.maxY - 432
	backgroundColor: "e7e7e7"

# For larger tap targets
audio.progressBar.style.boxShadow = "inset 0 -30px #fff"
audio.progressFill.style.boxShadow = "inset 0 -30px #fff"

audio.progressBar.centerX()
audio.progressFill.centerX()
audio.progressFill.backgroundColor = "transparent"

progressKnob = new Layer 
	backgroundColor: "#FF2D55"
	width:3, height:30
	y: audio.progressBar.y - 7.5
	x: audio.progressBar.x - 1.5

audio.progressFill.on "change:width", ->
	progressKnob.x = @width + audio.progressBar.x

audio.showTime = true
audio.time.x = audio.progressBar.x - 56
audio.time.centerY(280)

audio.showTimeLeft = true
audio.timeLeft.x = audio.progressBar.maxX + 16
audio.timeLeft.centerY(278)

# VolumeBar
audio.showVolume = true
audio.volumeBar.properties = 
	width: 540, height: 26
	y: sketch.screen.height - 117
	
audio.volumeBar.centerX()

# Tap Targets
audio.volumeBar.style.boxShadow = "inset 0 -20px #f7f7f7"
audio.volumeFill.style.boxShadow = "inset 0 -20px #f7f7f7"

# Define iOS Volume Knob
volumeKnob = new Layer backgroundColor: "#fff", width:32, height:32, y: audio.volumeBar.y - 12, x: audio.volumeBar.width - 32, borderRadius: 40

# Style
volumeKnob.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.1), 0 5px 2px rgba(0,0,0,0.15)"

# Prevent it from interfering with the slider
volumeKnob.ignoreEvents = true

audio.volumeFill.on "change:width", ->
	volumeKnob.x = @width + audio.volumeBar.x - 16
	# Set max dragging width
	if volumeKnob.x > 620
		volumeKnob.x = 620	