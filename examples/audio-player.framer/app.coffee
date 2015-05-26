# Made with Framer
# by Benjamin den Boer
# www.framerjs.com

# Set default cursor
document.body.style.cursor = "auto"

# Include the module
{AudioPlayer} = require "audio"

# New AudioPlayer
audio = new AudioPlayer 
	audio: "audio.mp3"
	width: 300, height: 200
	image: "images/bg.png"
	borderRadius: 4
	
audio.center()
audio.y -= 50

audio.showProgress = true
audio.progressBar.centerX()
audio.progressBar.centerY(100)

# Text
audio.timeStyle = { "font-size": "13px", "color": "#888" }

# Time
audio.showTime = true
audio.time.x = audio.x
audio.time.centerY(136)

# TimeLeft
audio.showTimeLeft = true
audio.timeLeft.x = audio.maxX - 30
audio.timeLeft.centerY(136)