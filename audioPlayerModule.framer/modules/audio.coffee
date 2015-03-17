# Set default cursor
document.body.style.cursor = "auto"

# AudioPlayer Class
class exports.AudioPlayer extends Layer
	
	constructor: (options={}) ->
		options.backgroundColor ?= "transparent"			
		super options
				
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
		
		@timeStyle = { "font-size": "20px", "color": "#000" }
		
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
		set: (audio) -> 
			@player.src = audio	
			if @player.canPlayType("audio/mp3") == ""
				throw Error "No supported audio file included."
	
	@define "showProgress",
		get: -> @_showProgress
		set: (showProgress) -> @setProgress(showProgress, false)
	
	@define "showVolume",
		get: -> @_showVolume
		set: (showVolume) -> @setVolume(showVolume, false)
	
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
			
	getTime: (showTime) ->
		@_checkBoolean(showTime)
		@_showTime = showTime
	
		if showTime is true
			@time = new Layer backgroundColor: "transparent"
			@time.style = @timeStyle
			@time.html = "0:00"

	getTimeLeft: (showTimeLeft) =>
		@_checkBoolean(showTimeLeft)
		@_showTimeLeft = showTimeLeft
		
		if showTimeLeft is true
			@timeLeft = new Layer backgroundColor: "transparent"
			@timeLeft.style = @timeStyle
			
			# Set timeLeft
			@timeLeft.html = "-0:00"			
			@player.on "loadedmetadata", => 
				@timeLeft.html = "-" + @player.formatTimeLeft()
		
	setProgress: (showProgress) ->
		@_checkBoolean(showProgress)
		
		# Set argument (showProgress is either true or false)
		@_showProgress = showProgress
		
		if @_showProgress is true
			# Create Progress Bar + Defaults	
			@progressBar = new Layer 
				width: 200, height:6, backgroundColor: "#eee"
				clip:true
			
			# Progress layer + Defaults
			@progressFill = new Layer 
				width: 0, height: @progressBar.height, backgroundColor: "#222"
				superLayer: @progressBar

			@progressBar.on "change:height", -> 
				progressFill.height = @height
				
			# To allow clipping with borderRadius
			@progressFill.force2d = true 
			
			# Allow scrubbing of time
			mousedown = wasPlaying = false
			offsetX = null
			
			# Store variables
			progressFill = @progressFill
			progressWidth = @progressBar.width
			
			@progressBar.on Events.TouchStart, (event) =>
				mousedown = true
				if not @player.paused then wasPlaying = true
						
			# To allow scrubbing outside of the progressBar
			Framer.Device.screen.on Events.TouchMove, (event) =>
				newFrame = scaledScreenFrame(Framer.Device.screen)
				eventX = Utils.round(Events.touchEvent(event).clientX - newFrame.x, 1)
				progressWidth = @progressBar.width * @progressBar.screenScaleX()
				progressX = @progressBar.x * @progressBar.screenScaleX()
				offsetX = (eventX - progressX)
				
				offsetX = Utils.modulate(offsetX, [0, progressWidth], [0, progressWidth], true)
			
				if mousedown is true 
					@player.pause()
					@player.currentTime = @player.duration * (offsetX / progressWidth)
					
			Framer.Device.screen.on Events.TouchEnd, (event) => 
				if mousedown is true
					@player.currentTime = @player.duration * (offsetX / progressWidth)
					
					currentTime = Math.round(@player.currentTime)
					duration = Math.round(@player.duration)
						
					if wasPlaying and currentTime isnt duration
						@player.play()
						@controls.showPause()
						
					if currentTime is duration
						@player.pause()
						@controls.showPlay()
			
				mousedown = false
					
			# Update Progress
			@player.ontimeupdate = =>
				@progressFill.width = @player.baseProgressOn(@progressBar)
				@time.html = @player.formatTime()
				@timeLeft.html = "-" + @player.formatTimeLeft()
	
	setVolume: (showVolume) ->
		@_checkBoolean(showVolume)
		
		# Set default to 75%
		@player.volume = 0.75
		
		@volumeBar = new Layer width: 200, height:6, backgroundColor: "#eee", clip:true
		@volumeBar.y += 24
		
		@volumeFill = new Layer width: @volumeBar.width*0.75, height:@volumeBar.height, backgroundColor: "#333", superLayer: @volumeBar
		@volumeFill.force2d = true 
		
		@volumeBar.on "change:height", => @volumeFill.height = @volumeBar.height
		@volumeBar.on "change:width", => @volumeFill.width = @volumeBar.width*0.75
				
		mousedown = false
		getVolume = null
		
		@volumeBar.on Events.TouchStart, (event) ->
			mousedown = true
					
		# Events
		Framer.Device.screen.on Events.TouchMove, (event) =>
			newFrame = scaledScreenFrame(Framer.Device.screen)
			eventX = Utils.round(Events.touchEvent(event).clientX - newFrame.x, 1)
			volumeWidth = @volumeBar.width * @volumeBar.screenScaleX()
			volumeX = @volumeBar.x * @volumeBar.screenScaleX()
				
			getVolume = (eventX - volumeX)
			getVolume = Utils.modulate(getVolume, [0, volumeWidth], [0,1], true)
							
			if mousedown is true
				@player.volume = getVolume
			
		Framer.Device.screen.on Events.TouchEnd, (event) =>
			if mousedown is true
				@player.volume = getVolume
			mousedown = false
				
		@player.onvolumechange = =>
			@volumeFill.width = @player.baseVolumeOn(@volumeBar)

# Helper Functions
scaledScreenFrame = (layer) ->
	frame = layer.screenFrame
	frame.width  *= layer.screenScaleX()
	frame.height *= layer.screenScaleY()
	frame.x += (layer.width -  frame.width)  * layer.originX
	frame.y += (layer.height - frame.height) * layer.originX
	return frame