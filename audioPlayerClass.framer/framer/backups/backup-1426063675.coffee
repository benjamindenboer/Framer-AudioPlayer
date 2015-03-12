# Set default cursor
document.body.style.cursor = "auto"

# AudioLayer Class
class AudioLayer extends Layer
	
	constructor: (options={}) ->
		super options
		
		@player = document.createElement("audio")
		@player.setAttribute("webkit-playsinline", "true")
		@player.setAttribute("preload", "auto")
		@player.style.width = "100%"
		@player.style.height = "100%"

		@player.on = @player.addEventListener
		@player.off = @player.removeEventListener

		@player.getTime = ->
			sec = Math.floor(@currentTime)
			min = Math.floor(sec / 60)
			sec = Math.floor(sec % 60)
			sec = if sec >= 10 then sec else '0' + sec
			return "#{min}:#{sec}"
		
		@player.getTimeLeft = ->
			sec = Math.floor(@duration) - Math.floor(@currentTime)
			min = Math.floor(sec / 60)
			sec = Math.floor(sec % 60)
			sec = if sec >= 10 then sec else '0' + sec
			return "#{min}:#{sec}"

		@player.baseProgressOn = (layer) ->
			Utils.modulate(@currentTime, [0, @duration],[0,layer.width], true)
    
		@audio = options.audio
		@_element.appendChild(@player)
	
	@define "audio",
		get: -> @player.src
		set: (audio) -> @player.src = audio
		
	play: -> @player.play()
	pause: -> @player.pause()
	
	stop: -> 
		@player.pause()
		@player.setTime(0)
		
	isPlaying: -> return @player.paused is false
	
		
# New AudioLayer
audio = new AudioLayer audio: "audio.mp3", width: 300, height:200, image: "images/bg.png", borderRadius: 4
audio.center()
audio.y -= 50

# Controls
controls = new Layer image: "images/play.png", width:80, height:80, superLayer: audio
controls.center()

# Progress Bar
progressBar = new Layer width: 200, height:6, backgroundColor: "#eee", borderRadius: 40, clip:true
progressBar.center()
progressBar.y += 100

# Play, Pause
audio.on Events.Click, ->
	if audio.isPlaying()
		audio.pause()
		controls.image = "images/play.png"
	else
		audio.play()
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

timeLeft.html = "0:00"
audio.player.on "loadedmetadata", -> timeLeft.html = @getTimeLeft()

# Progress 
progress = new Layer width: 0, height:6, backgroundColor: "#333", borderRadius: 40, superLayer: progressBar
progress.force2d = true # To allow clipping with borderRadius


# Update Progress
audio.player.ontimeupdate = ->
	progress.width = audio.player.baseProgressOn(progressBar)
  
	showTime.html = audio.player.getTime()
	timeLeft.html = "-" + audio.player.getTimeLeft()

# Allow scrubbing of time
mousedown = wasPlaying = false
offsetX = null

progressBar.on Events.TouchStart, (event) ->
	mousedown = true

	if audio.isPlaying()
		wasPlaying = true

document.addEventListener Events.TouchMove, (event) ->
	
	offsetX = (event.x - progressBar.x)
	
	if mousedown is true and offsetX >= 0 and offsetX <= 200
		audio.player.pause()
		audio.player.currentTime = audio.player.duration * (offsetX / 200)

document.addEventListener Events.TouchEnd, (event) -> 
	if mousedown is true
		audio.player.currentTime = audio.player.duration * (offsetX / 200)
	
		if wasPlaying
			audio.player.play()
			controls.image = "images/pause.png"

	mousedown = false
	
	
# On end, switch back to play button
audio.player.onended = -> controls.image = "images/play.png"