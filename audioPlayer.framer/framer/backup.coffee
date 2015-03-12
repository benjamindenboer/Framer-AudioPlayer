# Set default cursor
document.body.style.cursor = "auto"

# Load audio.mp3 file
audio = new Audio "audio.mp3"

# A function that checks if the track is playing.
# Only returns true when it's playing 
isPlaying = (audio) -> return audio.paused is false

# Cover
cover = new Layer width: 300, height:200, image: "images/bg.png", borderRadius: 4
cover.center()
cover.y -= 50

# Controls
controls = new Layer image: "images/play.png", width:80, height:80, superLayer: cover
controls.center()

# Progress Bar
progressBar = new Layer width: 200, height:6, backgroundColor: "#eee", borderRadius: 40, clip:true
progressBar.center()
progressBar.y += 100

# Play, Pause
cover.on Events.Click, ->
	if isPlaying(audio) 
		audio.pause()
		controls.image = "images/play.png"
	else
		audio.play()
		duration = Math.round(audio.duration)
		controls.image = "images/pause.png"
	
# Time Indicators
textStyle = { "font-size": "13px", "color": "#999" }

showTime = new Layer backgroundColor: "transparent"
showTime.style = textStyle
showTime.centerX(-100)
showTime.centerY(136)
showTime.html = "0:00"

timeLeft = new Layer backgroundColor: "transparent"
timeLeft.style = textStyle
timeLeft.centerX(172)
timeLeft.centerY(136)
timeLeft.html = "-0:21"

# Progress 
progress = new Layer width: 0, height:6, backgroundColor: "#333", borderRadius: 40, superLayer: progressBar, opacity:0
progress.force2d = true # To allow clipping with borderRadius

# Update Progress
audio.ontimeupdate = ->
	time = audio.currentTime
	duration = audio.duration
	progress.opacity = 1
	progress.width = Utils.modulate(time, [0,duration],[0,progressBar.width], true)

	sec = Math.floor(time)
	sec = if sec < 10 then '0:0' + sec else '0:' + sec
	secLeft = Math.floor(duration - time)
	secLeft = if secLeft < 10 then '0:0' + secLeft else '0:' + secLeft
    
	showTime.html = sec
	timeLeft.html = "-" + secLeft
	
# Ability to set time by clicking on the progress bar
progressBar.on Events.Click, (event) ->
		audio.currentTime = audio.duration * (event.offsetX / 200)

# On end, switch back to play button
audio.onended = -> controls.image = "images/play.png"