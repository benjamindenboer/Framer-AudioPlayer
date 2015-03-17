# Set default cursor
document.body.style.cursor = "auto"

# AudioPlayer Class
class AudioPlayer extends Layer
	
	constructor: (options={}) ->			
		super options
		
		audio = @
		
		# Define basic controls
		@controls = new Layer 
			backgroundColor: "transparent"
			width:80, height:80, superLayer: @
			
		@controls.showPlay = -> @image = "images/play.png"
		@controls.showPause = -> @image = "images/pause.png"
		@controls.showPlay()
		@controls.center()
				
		# Define player
		@player = document.createElement("audio")
		@player.setAttribute("webkit-playsinline", "true")
		@player.setAttribute("preload", "auto")
		@player.style.width = "100%"
		@player.style.height = "100%"

		@player.on = @player.addEventListener
		@player.off = @player.removeEventListener
		
		# On click
		@on Events.Click, ->
			currentTime = Math.round(@player.currentTime)
			duration = Math.round(@player.duration)
			
			if @player.paused 
				@player.play()
				@controls.showPause()
				
				if currentTime is duration
					@player.currentTime = 0
					@player.play()
				
			else 
				@player.pause()
				@controls.showPlay()
				
		# On end, switch to play button
		audioControls = @controls	
		@player.onended = -> 
			audioControls.showPlay()
			
		# Utils 
		@player.baseProgressOn = (layer) ->
			Utils.modulate(@currentTime, [0, @duration],[0,layer.width], true)

		@player.baseVolumeOn = (layer) ->
			Utils.modulate(@volume, [0, 1],[0,layer.width], true)
					
		@player.formatTime = ->
			sec = Math.floor(@currentTime)
			min = Math.floor(sec / 60)
			sec = Math.floor(sec % 60)
			sec = if sec >= 10 then sec else '0' + sec
			return "#{min}:#{sec}"
			
		@player.formatTimeLeft = ->
			sec = Math.floor(@duration) - Math.floor(@currentTime)
			min = Math.floor(sec / 60)
			sec = Math.floor(sec % 60)
			sec = if sec >= 10 then sec else '0' + sec
			return "#{min}:#{sec}"
					
		@audio = options.audio
		@_element.appendChild(@player)
	
	@define "audio",
		get: -> @player.src
		set: (audio) -> @player.src = audio	
	
	@define "showProgress",
		get: -> @_showProgress
		set: (showProgress) -> @setProgress(showProgress, false)
	
	@define "showVolume",
		get: -> @_showVolume
		set: (showVolume) -> @player.setVolume(showVolume, false)
	
	@define "showTime",
		get: -> @_showTime
		set: (showTime) -> @getTime(showTime, false)
	
	@define "showTimeLeft",
		get: -> @_showTimeLeft
		set: (showTimeLeft) -> @getTimeLeft(showTimeLeft, false)
				
	# Checks a property, returns "true" or "false"
	_checkBoolean: (property) ->
		if _.isString(property)
			if property.toLowerCase() in ["1", "true"]
				property = true
			else if property.toLowerCase() in ["0", "false"]
				property = false
			else
				return
		if not _.isBool(property) then return
			
	textStyle = { "font-size": "13px", "color": "#666" }
	
	getTime: (showTime) ->
		@_checkBoolean(showTime)
		@_showTime = showTime
	
		if showTime is true
			@time = new Layer backgroundColor: "transparent"
			@time.style = textStyle
			@time.html = "0:00"

	getTimeLeft: (showTimeLeft) ->
		@_checkBoolean(showTimeLeft)
		@_showTimeLeft = showTimeLeft
		
		if showTimeLeft is true
			@timeLeft = new Layer backgroundColor: "transparent"
			@timeLeft.style = textStyle
			
			# Set timeLeft
			@timeLeft.html = "-0:00"			
			@player.on "loadedmetadata", -> 
				audio.timeLeft.html = "-" + @formatTimeLeft()
	
	setProgress: (showProgress) ->
		@_checkBoolean(showProgress)
		
		# Set argument (showProgress is either true or false)
		@_showProgress = showProgress
		
		if @_showProgress is true
			# Create Progress Bar + Defaults
			@progressBar = new Layer 
				width: 200, height:6, backgroundColor: "#eee"
				clip:true
			@progressBar.center()
			
			# Progress layer + Defaults
			@progressFill = new Layer 
				width: 0, height:6, backgroundColor: "#333"
				superLayer: @progressBar
			
			# To allow clipping with borderRadius
			@progressFill.force2d = true 
			
			# Allow scrubbing of time
			mousedown = wasPlaying = false
			offsetX = null
			
			# Store variables
			progressBar = @progressBar
			progressWidth = @progressBar.width
			progressFill = @progressFill
			player = @player
			controls = @controls
			audio = @
			
			@progressBar.on Events.TouchStart, (event) ->
				mousedown = true
				if not player.paused then wasPlaying = true
			
			# Add listeners to the document 
			# To allow scrubbing outside of the progressBar
			Events.wrap(document).addEventListener Events.TouchMove, (event) ->
				
				offsetX = (event.x - progressBar.x)
				offsetX = Utils.modulate(offsetX, [0, progressWidth], [0, progressWidth], true)
			
				if mousedown is true 
					player.pause()
					player.currentTime = player.duration * (offsetX / progressWidth)
			
			Events.wrap(document).addEventListener Events.TouchEnd, (event) -> 
				if mousedown is true
					player.currentTime = player.duration * (offsetX / progressWidth)
					
					currentTime = Math.round(player.currentTime)
					duration = Math.round(player.duration)
						
					if wasPlaying and currentTime isnt duration
						player.play()
						controls.showPause()
						
					if currentTime is duration
						player.pause()
						controls.showPlay()
			
				mousedown = false
					
			# Update Progress
			@player.ontimeupdate = ->
				progressFill.width = @baseProgressOn(progressBar)
				audio.time.html = @formatTime()
				audio.timeLeft.html = "-" + @formatTimeLeft()
	
	setVolume: (showVolume) ->
		@_checkBoolean(showVolume)
		
		# Set default to 75%
		@player.volume = 0.75
		
		@volumeBar = new Layer 
			width: 200, height:6, backgroundColor: "#eee", clip:true,
		@volumeBar.center()
		@volumeBar.y += 24
		
		@volumeFill = new Layer 
			width: @volumeBar.width*0.75, height:6, backgroundColor: "#333"
			superLayer: @volumeBar
		@volumeFill.force2d = true 
		
		mousedown = false
		setVolumeWidth = getVolume = null
		
		@volumeBar.on Events.TouchStart, (event) ->
			mousedown = true
			
		# Set Variables
		volumeBar = @volumeBar
		volumeWidth = @volumeBar.width
		volumeFill = @volumeFill
		player = @player
			
		# Events
		Events.wrap(document).addEventListener Events.TouchMove, (event) ->
	
			getVolume = (event.x - volumeBar.x)
			getVolume = Utils.modulate(getVolume, [0, volumeWidth], [0,1], true)	
			if mousedown is true 
				player.volume = getVolume
			
		Events.wrap(document).addEventListener Events.TouchEnd, (event) ->
			if mousedown is true
				player.volume = getVolume
			mousedown = false
				
		player.onvolumechange = ->
			volumeFill.width = @baseVolumeOn(volumeBar)
							
# New AudioPlayer
audio = new AudioPlayer audio: "audio.mp3", width: 300, height:200, image: "images/bg.png", borderRadius: 4
audio.center()
audio.y -= 50

audio.showProgress = true
audio.progressBar.y += 100

audio.showTime = true
audio.time.centerX(-100)
audio.time.centerY(136)

audio.showTimeLeft = true
audio.timeLeft.centerX(172)
audio.timeLeft.centerY(136)
	

