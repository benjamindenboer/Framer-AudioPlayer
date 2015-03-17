# Framer AudioPlayer
AudioPlayer Class for Framer. 

## Examples
###### 1. [Basic AudioPlayer Example](http://share.framerjs.com/mz633vr9l57p/)
###### 2. [AudioPlayer Class](http://share.framerjs.com/bplu2b1se9bv/) 
###### 3. [AudioPlayer Module (iOS Example)](http://share.framerjs.com/z7b91klf85q2/) 

![AudioPlayer Preview](http://cl.ly/aBUw/preview.png)

### AudioPlayer Class

```javascript
audio = new AudioPlayer audio: "audio.mp3"
audio.player.play()
```

##### Progress Bar
Set `showProgress` to true. 
```javascript
audio.showProgress = true
audio.progressBar.properties = 
	width: 556, height:44
	backgroundColor: "e7e7e7"
```

To target & customize the fill:
```javascript
audio.progressFill.backgroundColor = "transparent"
```
---

##### Volume Bar
Set `showVolume` to true. 
```javascript
audio.showVolume = true
```

To target & customize the fill:
```javascript
audio.volumeFill.backgroundColor = "#000"
```

---

##### Time
Set `showTime` to true. 
```javascript
audio.showTime = true
```

##### TimeLeft
Set `showTimeLeft` to true. 
```javascript
audio.showTimeLeft = true
```


#### Progress

The AudioPlayer class includes a few handy functions, that aim to make it easier to quickly set-up and design with audio. The first is `baseProgressOn(layer)`, which automatically calculates the current width of a layer, based on another layer. This allows you to easily visualize progress.

```javascript
progress = new Layer 
  width: 0, height:6,
  backgroundColor: "#333", borderRadius: 40, 
  superLayer: progressBar

audio.player.ontimeupdate = ->
	progress.width = audio.player.baseProgressOn(progressBar)
```

#### Time
It also includes two functions that automatically format time for you in a **minutes:seconds** format. Both a `getTime()` and `getTimeLeft()` function.

```javascript
audio.player.ontimeupdate = ->
	showTime.html = audio.player.getTime()
	timeLeft.html = "-" + audio.player.getTimeLeft()
```

![AudioPlayer TimeLeft Preview](http://cl.ly/aB3v/getTimeLeft.png)

---

#### Progress Bar Interaction / Scrubbing

Similar to how scrubbers work on iOS, we want to allow people to drag beyond the progressBar, as long as you started by clicking within the progressBar. We also check if the audio was playing on click, so we can pause it during scrub-movement for smoother scrubbing.

```javascript
progressBar.on Events.TouchStart, (event) ->
	mousedown = true
	if audio.isPlaying() then wasPlaying = true
```

While dragging/scrubbing, update the currentTime of the track, which will automatically be correctly visualized since our `baseProgressOn(layer)` function is based on the currentTime.

```javascript
Events.wrap(document).addEventListener Events.TouchMove, (event) ->
	offsetX = (event.x - progressBar.x)
	
	if mousedown is true and offsetX >= 0 and offsetX <= 200
		audio.player.pause()
		audio.player.currentTime = audio.player.duration * (offsetX / 200)
```

Finally, we listen to `TouchEnd` events and update the time + allow for clicks to set the time. If it was already playing, and you click somewhere within the progressBar, we want the track to keep on playing.

```javascript
Events.wrap(document).addEventListener Events.TouchEnd, (event) -> 
	if mousedown is true
		audio.player.currentTime = audio.player.duration * (offsetX / 200)
	
		if wasPlaying
			audio.player.play()
			controls.image = "images/pause.png"

	mousedown = false
```
---
#### To-do:
- Look into implementing a default play/pause/stop buttons within the Class.
- Rapid scrubs can off-set the time currently.
- Implement fastForward and rewind behavior.

---

The HTML5 DOM includes many methods and properties around Audio and Video that can be used. Still, when designing AudioPlayers there are many things you may run into that initially take a bit of time to set-up:

- Creating a progressBar, dynamically calculating its width
- Creating a volumeBar
- Defining the scrubbing behaviours
- Properly formatting the time and timeLeft
- Implementing basic play/pause behaviors

Reference: http://www.w3schools.com/tags/ref_av_dom.asp
Feel free to reach out on [Twitter](https://twitter.com/benjaminnathan/) for any questions.
