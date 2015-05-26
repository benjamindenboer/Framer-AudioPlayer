# Framer AudioPlayer Module
The **AudioPlayer Module** for Framer makes it easier for you to prototype with music. It allows you to easily visualize the **time**, **duration**, **progress**, **volume** and more. It combines the power of the [HTML Audio Methods](http://www.w3schools.com/tags/ref_av_dom.asp) with the flexibility of Components. The AudioPlayer takes care of all of the common interactions for you, while remaining completely customizable. 

## Examples
#### 1. [Audio Player Example](http://share.framerjs.com/6nbgnpqlfmpi/)
A simple audio-player with the current time and time-left visualized.

#### 2. [iOS Music App](http://share.framerjs.com/pdh9twa91amo/)
iOS Music app prototype with a customized progress scrubber and volume slider.

#### 3. [Material Music App](http://share.framerjs.com/kjmkhlf36pzo/)
Prototype of a material-design music app with multiple songs, next-previous controls and more.

![AudioPlayerModule Preview](http://cl.ly/b4ly/audio-github.png)


---

## Get Started

The AudioPlayer creates a new Layer for you that includes an `audio` property. 

```javascript
audio = new AudioPlayer audio: "audio.mp3"
audio.player.play()
```

By default, it will look for `play.png` and `pause.png` images within your `/images/` folder. The appearance of the player itself can also be customized. To include a background-image, for instance:

```javascript
audio = new AudioPlayer 
	audio: "audio.mp3"
	width: 300, height: 200
	image: "images/bg.png"
	borderRadius: 4

audio.center()
```


#### Progress Bar
Set `showProgress` to true. 
```javascript
audio.showProgress = true
```
---

#### Volume Bar
Set `showVolume` to true. 
```javascript
audio.showVolume = true
```

(Note that iOS doesn't allow you to change the volume via JavaScript, so when previewing on iOS Devices, the volumeBar may be unresponsive)

---

#### Time
Set `showTime` to true. The layer properties (`audio.time`) and formatting (`audio.timeStyle`) can be changed as well.
```javascript
audio.showTime = true
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

## Including the Module
To include the AudioPlayer Class as a module, get the audio.coffee file from within the `/module` folder and place it within the `/modules` folder of your prototype. 

```javascript
{AudioPlayer} = require "audio"

audio = new AudioPlayer 
	audio: "audio.mp3"
	width: 80, height: 80
```

![AudioPlayer Previews](http://cl.ly/b4v7/audio-banner-github.png)

---

- Made for and with [Framer](www.framerjs.com)
- Follow me on [Twitter](https://twitter.com/benjaminnathan/) for updates
