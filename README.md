# Framer AudioPlayer
Explorations of working with Audio within Framer. The HTML5 DOM includes many methods and properties around Audio and Video that can be used. Still, when designing AudioPlayers there are many things you may run into that initially take a bit of time to set-up:

- Creating a progress bar, dynamically calculating its width on timeUpdate
- Defining a proper scrubbing interaction for a progressBar
- Properly formatting the currentTime
- Properly formatting and getting the timeLeft
- Implementing basic play/pause/stop behaviors

#### Examples
###### - [Basic AudioPlayer Example (without Class)](http://share.framerjs.com/h1vucporwyxs/)
###### - [AudioPlayer Class](http://share.framerjs.com/go3wrgbprhax/)

![AudioPlayer Preview](http://cl.ly/aBUw/preview.png)

#### AudioPlayer Class

```javascript
audio = new AudioPlayer audio: "audio.mp3"
audio.player.play()
```
#### Progress

The AudioPlayer class includes a few handy functions, that aim to make it easier to quickly set-up and design with audio. The first is *baseProgressOn(layer)*, which automatically calculates the current width of a layer, based on another layer. This allows you to easily visualize progress.

```javascript
# Visualize Progress 
progress = new Layer 
  width: 0, height:6,
  backgroundColor: "#333", borderRadius: 40, 
  superLayer: progressBar

# Update Progress
audio.player.ontimeupdate = ->
	# Calculate current width
	progress.width = audio.player.baseProgressOn(progressBar)
```

#### Time
It also includes two functions that automatically format time for you in a *minutes:seconds* format. Both a *getTime()* and *getTimeLeft* function.

```javascript
audio.player.ontimeupdate = ->
  showTime.html = audio.player.getTime()
	timeLeft.html = "-" + audio.player.getTimeLeft()
```

![AudioPlayer TimeLeft Preview](http://cl.ly/aB3v/getTimeLeft.png)

#### Progress Bar Interaction / Scrubbing
```javascript
# Add eventListeners to the document to allow scrubbing outside of the progressBar
Events.wrap(document).addEventListener Events.TouchMove, (event) ->
	offsetX = (event.x - progressBar.x)
	
	if mousedown is true and offsetX >= 0 and offsetX <= 200
		audio.player.pause()
		audio.player.currentTime = audio.player.duration * (offsetX / 200)

Events.wrap(document).addEventListener Events.TouchEnd, (event) -> 
	if mousedown is true
		audio.player.currentTime = audio.player.duration * (offsetX / 200)
	
		if wasPlaying
			audio.player.play()
			controls.image = "images/pause.png"

	mousedown = false
```
