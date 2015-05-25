# Framer AudioPlayer
AudioPlayer Class for Framer. Aims to make it easier to start working with Audio in Framer. Includes customizable controls, play/pause behaviour, optional progressBar, volumeBar, time and more.

## Examples
###### 1. [Basic AudioPlayer Example](http://share.framerjs.com/mz633vr9l57p/)
###### 2. [AudioPlayer Class](http://share.framerjs.com/bplu2b1se9bv/) 
###### 3. [AudioPlayer Module (iOS Example)](http://share.framerjs.com/z7b91klf85q2/) 

![AudioPlayerModule Preview](https://www.imageupload.co.uk/images/2015/03/17/ap4.png)

---

## AudioPlayer Class

```javascript
audio = new AudioPlayer audio: "audio.mp3"
audio.player.play()
```

### Progress Bar
Set `showProgress` to true. 
```javascript
audio.showProgress = true
audio.progressBar.properties = 
	width: 556, height:44
	backgroundColor: "e7e7e7"
```
---

### Volume Bar
Set `showVolume` to true. 
```javascript
audio.showVolume = true
```

(Note that iOS doesn't allow you to change the volume via JavaScript, so when previewing on iOS Devices, the volumeBar may be unresponsive)

---

### Time
Set `showTime` to true. The layer properties (`audio.time`) and formatting (`audio.timeStyle`) can be changed as well.
```javascript
audio.showTime = true
audio.time.x = audio.progressBar.x - 60
audio.time.centerY(280)

```

### TimeLeft
Set `showTimeLeft` to true. 
```javascript
audio.showTimeLeft = true
```

`timeStyle` targets both of the times defined by `showTime` and `showTimeLeft`.
```javascript
audio.timeStyle = { "font-size": "14px", "color": "#888" }
```
---

## Module
To include the AudioPlayer Class as a module, get the audio.coffee file from the AudioPlayerModule example and place it within the /modules folder of your prototype. 

```javascript
# Include the module
{AudioPlayer} = require "audio"

# Create a new AudioPlayer
audio = new AudioPlayer 
	audio: "audio.mp3"
	width: 80, height: 80
```

![AudioPlayer Previews](http://cl.ly/aFrl/playerPreviews.png)

---

Find me on [Twitter](https://twitter.com/benjaminnathan/) for any questions.
