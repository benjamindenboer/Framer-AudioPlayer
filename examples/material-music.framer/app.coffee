# Made with Framer
# by Benjamin den Boer
# www.framerjs.com

# Sketch Import
sketch = Framer.Importer.load "imported/material-music"

# Include the module 
{AudioPlayer} = require "audio"

# Set device background 
Framer.Device.background.style.background = 
	"linear-gradient(45deg, #fff 0%, #caeaf7 100%)"

# Scrollable
scroll = ScrollComponent.wrap(sketch.content)
scroll.scrollHorizontal = false
scroll.clip = false 
scroll.contentInset = {bottom: 280}

scroll.on Events.Move, ->
	# Scale album cover
	if this.y > 0
		scale = Utils.modulate(this.y, [0, 700], [1, 1.65], true)
		sketch.cover.scale = scale
		sketch.cover.originY = 0
		
	# Set maximum scrolling distance
	if this.y < -540 then this.y = -540

# Audio
audio = new AudioPlayer audio: "the-curtain-rises.mp3", width: 72, height: 72, superLayer: sketch.controls

# Copy the frame (x,y, width, height) of the audioPlayer
audio.frame = sketch.iconPlay.frame
audio.controls.showPlay = -> @image = sketch.iconPlay.image
audio.controls.showPause = -> @image = sketch.iconPause.image

# Progress 
audio.showProgress = true
audio.progressBar.frame = sketch.progress.frame
audio.progressBar.knob.visible = false

audio.progressBar.props = {
	superLayer: scroll.content
	backgroundColor: "#fff"
	borderRadius: 0
}

audio.progressBar.fill.backgroundColor = "#FF4181"

# Object containing our songs
songs = {
	1: name: "The Curtain Rises", src: "the-curtain-rises.mp3"
	2: name: "Rollin' at 5", src: "rollin-at-5.mp3"
	3: name: "Life of Riley", src: "life-of-riley.mp3"
	4: name: "Local Forecast", src: "local-forecast.mp3"
}

title = new Layer 
	superLayer: sketch.name, width: 800
	backgroundColor: "transparent"
	
title.html = "The Curtain Rises"
title.style = { "font" : "400 72px/1.2 Roboto" }

# Array for upcoming songs
upNext = []

for i in [0...3]
	next = new Layer
		superLayer: sketch.nextTitles
		backgroundColor: "transparent" 
		width: 400, height: 50
		x: 172, y: 84 * i
		
	next.html = "Life of Riley"
	next.style = { "font" : "400 40px/1 Roboto", "color" : "#666" }
	
	# Store in array
	upNext.push(next)  
	
# Set defaults
upNext[0].html =  "Rollin' at 5"
upNext[1].html =  "Life of Riley"
upNext[2].html =  "Local Forecast"
	
# Start at the first song
i = 1

# Function to switch and reset songs
switchSongs = (number) ->
	audio.player.pause()
	audio.player.currentTime = 0
	
	for item, props of songs 
		if item is "#{number}"
			audio.player.src = props.src 
			title.html = props.name 
			audio.player.play()
			
		if number == 1 
			if item is "#{number+1}" then upNext[0].html = props.name
			if item is "#{number+2}" then upNext[1].html = props.name
			if item is "#{number+3}" then upNext[2].html = props.name
			
		if number == 2 
			if item is "#{number+1}" then upNext[0].html = props.name
			if item is "#{number+2}" then upNext[1].html = props.name
			if item is "#{number-1}" then upNext[2].html = props.name
			
		if number == 3
			if item is "#{number+1}" then upNext[0].html = props.name
			if item is "#{number-2}" then upNext[1].html = props.name
			if item is "#{number-1}" then upNext[2].html = props.name
		
		if number == 4
			if item is "#{number-3}" then upNext[0].html = props.name
			if item is "#{number-2}" then upNext[1].html = props.name
			if item is "#{number-1}" then upNext[2].html = props.name

# Toggle next songs
sketch.iconNext.on Events.Click, ->
	i += 1
	if i > 4 then i = 1
	switchSongs(i)

# Toggle previous songs
sketch.iconPrev.on Events.Click, ->
	i -= 1
	if i < 0 then i = 4
	switchSongs(i)