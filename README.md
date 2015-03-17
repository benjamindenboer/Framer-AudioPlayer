# Framer AudioPlayer
AudioPlayer Class for Framer. 

## Examples
###### 1. [Basic AudioPlayer Example](http://share.framerjs.com/mz633vr9l57p/)
###### 2. [AudioPlayer Class](http://share.framerjs.com/bplu2b1se9bv/) 
###### 3. [AudioPlayer Module (iOS Example)](http://share.framerjs.com/z7b91klf85q2/) 

---

### AudioPlayer Class

```javascript
audio = new AudioPlayer audio: "audio.mp3"
audio.player.play()
```

#### Progress Bar
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

#### Volume Bar
Set `showVolume` to true. 
```javascript
audio.showVolume = true
```

To target & customize the fill:
```javascript
audio.volumeFill.backgroundColor = "#000"
```

---

#### Time
Set `showTime` to true. The layer properties (`audio.time`) and formatting (`audio.timeStyle`) can be changed as well.
```javascript
audio.showTime = true
audio.time.x = audio.progressBar.x - 60
audio.time.centerY(280)

```

#### TimeLeft
Set `showTimeLeft` to true. 
```javascript
audio.showTimeLeft = true
```

`timeStyle` targets both of the times defined by `showTime` and `showTimeLeft`.
```javascript
audio.timeStyle = { "font-size": "14px", "color": "#888" }
```
---

![AudioPlayerModule Preview](http://cl.ly/aFjj/Ap.png)

## Module
To include the AudioPlayer Class as a module, get the audio.coffee file from the AudioPlayerModule example and place it within the /modules folder of your prototype. Then, include it within your project:

```javascript
{AudioPlayer} = require "audio"
audio = new AudioPlayer audio: "audio.mp3", width: 80, height: 80
```

![AudioPlayer Previews](http://cl.ly/aFrl/playerPreviews.png)

---
#### To-do (ideas):
- Implement a volumeKnob and progressKnob by default.
- Implement forward and rewind behaviors.

---

The AudioPlayer class aims to make it a lot easier to start designing with Audio in Framer. The HTML5 DOM includes many methods and properties around Audio and Video that can be used. Still, when designing AudioPlayers there are many things you may run into that initially take a bit of time to set-up:

- Creating a progressBar
- Creating a volumeBar
- Defining the scrubbing behaviours
- Properly formatting the time and timeLeft
- Implementing basic play/pause behaviors

Reference: http://www.w3schools.com/tags/ref_av_dom.asp
Feel free to reach out on [Twitter](https://twitter.com/benjaminnathan/) for any questions.
