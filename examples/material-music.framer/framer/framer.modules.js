require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"audio":[function(require,module,exports){
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.AudioPlayer = (function(superClass) {
  extend(AudioPlayer, superClass);

  function AudioPlayer(options) {
    if (options == null) {
      options = {};
    }
    this.getTimeLeft = bind(this.getTimeLeft, this);
    if (options.backgroundColor == null) {
      options.backgroundColor = "transparent";
    }
    this.player = document.createElement("audio");
    this.player.setAttribute("webkit-playsinline", "true");
    this.player.setAttribute("preload", "auto");
    this.player.style.width = "100%";
    this.player.style.height = "100%";
    this.player.on = this.player.addEventListener;
    this.player.off = this.player.removeEventListener;
    AudioPlayer.__super__.constructor.call(this, options);
    this.controls = new Layer({
      backgroundColor: "transparent",
      width: 80,
      height: 80,
      superLayer: this,
      name: "controls"
    });
    this.controls.showPlay = function() {
      return this.image = "images/play.png";
    };
    this.controls.showPause = function() {
      return this.image = "images/pause.png";
    };
    this.controls.showPlay();
    this.controls.center();
    this.timeStyle = {
      "font-size": "20px",
      "color": "#000"
    };
    this.on(Events.Click, function() {
      var currentTime, duration;
      currentTime = Math.round(this.player.currentTime);
      duration = Math.round(this.player.duration);
      if (this.player.paused) {
        this.player.play();
        this.controls.showPause();
        if (currentTime === duration) {
          this.player.currentTime = 0;
          return this.player.play();
        }
      } else {
        this.player.pause();
        return this.controls.showPlay();
      }
    });
    this.player.onplaying = (function(_this) {
      return function() {
        return _this.controls.showPause();
      };
    })(this);
    this.player.onended = (function(_this) {
      return function() {
        return _this.controls.showPlay();
      };
    })(this);
    this.player.formatTime = function() {
      var min, sec;
      sec = Math.floor(this.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : '0' + sec;
      return min + ":" + sec;
    };
    this.player.formatTimeLeft = function() {
      var min, sec;
      sec = Math.floor(this.duration) - Math.floor(this.currentTime);
      min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      sec = sec >= 10 ? sec : '0' + sec;
      return min + ":" + sec;
    };
    this.audio = options.audio;
    this._element.appendChild(this.player);
  }

  AudioPlayer.define("audio", {
    get: function() {
      return this.player.src;
    },
    set: function(audio) {
      this.player.src = audio;
      if (this.player.canPlayType("audio/mp3") === "") {
        throw Error("No supported audio file included.");
      }
    }
  });

  AudioPlayer.define("showProgress", {
    get: function() {
      return this._showProgress;
    },
    set: function(showProgress) {
      return this.setProgress(showProgress, false);
    }
  });

  AudioPlayer.define("showVolume", {
    get: function() {
      return this._showVolume;
    },
    set: function(showVolume) {
      return this.setVolume(showVolume, false);
    }
  });

  AudioPlayer.define("showTime", {
    get: function() {
      return this._showTime;
    },
    set: function(showTime) {
      return this.getTime(showTime, false);
    }
  });

  AudioPlayer.define("showTimeLeft", {
    get: function() {
      return this._showTimeLeft;
    },
    set: function(showTimeLeft) {
      return this.getTimeLeft(showTimeLeft, false);
    }
  });

  AudioPlayer.prototype._checkBoolean = function(property) {
    var ref, ref1;
    if (_.isString(property)) {
      if ((ref = property.toLowerCase()) === "1" || ref === "true") {
        property = true;
      } else if ((ref1 = property.toLowerCase()) === "0" || ref1 === "false") {
        property = false;
      } else {
        return;
      }
    }
    if (!_.isBoolean(property)) {

    }
  };

  AudioPlayer.prototype.getTime = function(showTime) {
    this._checkBoolean(showTime);
    this._showTime = showTime;
    if (showTime === true) {
      this.time = new Layer({
        backgroundColor: "transparent",
        name: "currentTime"
      });
      this.time.style = this.timeStyle;
      this.time.html = "0:00";
      return this.player.ontimeupdate = (function(_this) {
        return function() {
          return _this.time.html = _this.player.formatTime();
        };
      })(this);
    }
  };

  AudioPlayer.prototype.getTimeLeft = function(showTimeLeft) {
    this._checkBoolean(showTimeLeft);
    this._showTimeLeft = showTimeLeft;
    if (showTimeLeft === true) {
      this.timeLeft = new Layer({
        backgroundColor: "transparent",
        name: "timeLeft"
      });
      this.timeLeft.style = this.timeStyle;
      this.timeLeft.html = "-0:00";
      this.player.on("loadedmetadata", (function(_this) {
        return function() {
          return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
        };
      })(this));
      return this.player.ontimeupdate = (function(_this) {
        return function() {
          return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
        };
      })(this);
    }
  };

  AudioPlayer.prototype.setProgress = function(showProgress) {
    var isMoving, wasPlaying;
    this._checkBoolean(showProgress);
    this._showProgress = showProgress;
    if (this._showProgress === true) {
      this.progressBar = new SliderComponent({
        width: 200,
        height: 6,
        backgroundColor: "#eee",
        knobSize: 20,
        value: 0,
        min: 0
      });
      this.player.oncanplay = (function(_this) {
        return function() {
          return _this.progressBar.max = Math.round(_this.player.duration);
        };
      })(this);
      this.progressBar.knob.draggable.momentum = false;
      wasPlaying = isMoving = false;
      if (!this.player.paused) {
        wasPlaying = true;
      }
      this.progressBar.on("change:value", (function(_this) {
        return function() {
          _this.player.currentTime = _this.progressBar.value;
          if (_this.time && _this.timeLeft) {
            _this.time.html = _this.player.formatTime();
            return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
          }
        };
      })(this));
      this.progressBar.knob.on(Events.DragMove, (function(_this) {
        return function() {
          return isMoving = true;
        };
      })(this));
      this.progressBar.knob.on(Events.DragEnd, (function(_this) {
        return function(event) {
          var currentTime, duration;
          currentTime = Math.round(_this.player.currentTime);
          duration = Math.round(_this.player.duration);
          if (wasPlaying && currentTime !== duration) {
            _this.player.play();
            _this.controls.showPause();
          }
          if (currentTime === duration) {
            _this.player.pause();
            _this.controls.showPlay();
          }
          return isMoving = false;
        };
      })(this));
      return this.player.ontimeupdate = (function(_this) {
        return function() {
          if (!isMoving) {
            _this.progressBar.knob.midX = _this.progressBar.pointForValue(_this.player.currentTime);
            _this.progressBar.knob.draggable.isMoving = false;
          }
          if (_this.time && _this.timeLeft) {
            _this.time.html = _this.player.formatTime();
            return _this.timeLeft.html = "-" + _this.player.formatTimeLeft();
          }
        };
      })(this);
    }
  };

  AudioPlayer.prototype.setVolume = function(showVolume) {
    var base;
    this._checkBoolean(showVolume);
    if ((base = this.player).volume == null) {
      base.volume = 0.75;
    }
    this.volumeBar = new SliderComponent({
      width: 200,
      height: 6,
      backgroundColor: "#eee",
      knobSize: 20,
      min: 0,
      max: 1,
      value: this.player.volume
    });
    this.volumeBar.knob.draggable.momentum = false;
    this.volumeBar.on("change:width", (function(_this) {
      return function() {
        return _this.volumeBar.value = _this.player.volume;
      };
    })(this));
    return this.volumeBar.on("change:value", (function(_this) {
      return function() {
        return _this.player.volume = _this.volumeBar.value;
      };
    })(this));
  };

  return AudioPlayer;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmVuL0RvY3VtZW50cy9EZXNpZ24vRnJhbWVyTGl2ZS9GcmFtZXItQXVkaW9QbGF5ZXIvZXhhbXBsZXMvbWF0ZXJpYWwtbXVzaWMuZnJhbWVyL21vZHVsZXMvYXVkaW8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRUEscUJBQUMsT0FBRDs7TUFBQyxVQUFROzs7O01BQ3JCLE9BQU8sQ0FBQyxrQkFBbUI7O0lBRzNCLElBQUMsQ0FBQSxNQUFELEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkI7SUFDVixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsb0JBQXJCLEVBQTJDLE1BQTNDO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLFNBQXJCLEVBQWdDLE1BQWhDO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBZCxHQUFzQjtJQUN0QixJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFkLEdBQXVCO0lBRXZCLElBQUMsQ0FBQSxNQUFNLENBQUMsRUFBUixHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFDckIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxHQUFSLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUV0Qiw2Q0FBTSxPQUFOO0lBR0EsSUFBQyxDQUFBLFFBQUQsR0FBZ0IsSUFBQSxLQUFBLENBQ2Y7TUFBQSxlQUFBLEVBQWlCLGFBQWpCO01BQ0EsS0FBQSxFQUFPLEVBRFA7TUFDVyxNQUFBLEVBQVEsRUFEbkI7TUFDdUIsVUFBQSxFQUFZLElBRG5DO01BRUEsSUFBQSxFQUFNLFVBRk47S0FEZTtJQUtoQixJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsU0FBQTthQUFHLElBQUMs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bEIsSUFBQyxDQUFBLFNBQUQsR0FBaUIsSUFBQSxlQUFBLENBQ2hCO01BQUEsS0FBQSxFQUFPLEdBQVA7TUFBWSxNQUFBLEVBQVEsQ0FBcEI7TUFDQSxlQUFBLEVBQWlCLE1BRGpCO01BRUEsUUFBQSxFQUFVLEVBRlY7TUFHQSxHQUFBLEVBQUssQ0FITDtNQUdRLEdBQUEsRUFBSyxDQUhiO01BSUEsS0FBQSxFQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFKZjtLQURnQjtJQU9qQixJQUFDLENBQUEsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBMUIsR0FBcUM7SUFFckMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxFQUFYLENBQWMsY0FBZCxFQUE4QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFDN0IsS0FBQyxDQUFBLFNBQVMsQ0FBQyxLQUFYLEdBQW1CLEtBQUMsQ0FBQSxNQUFNLENBQUM7TUFERTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7V0FHQSxJQUFDLENBQUEsU0FBUyxDQUFDLEVBQVgsQ0FBYyxjQUFkLEVBQThCLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtlQUM3QixLQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsS0FBQyxDQUFBLFNBQVMsQ0FBQztNQURDO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QjtFQWxCVTs7OztHQTdMc0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgZXhwb3J0cy5BdWRpb1BsYXllciBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwidHJhbnNwYXJlbnRcIlxuXG5cdFx0IyBEZWZpbmUgcGxheWVyXG5cdFx0QHBsYXllciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKVxuXHRcdEBwbGF5ZXIuc2V0QXR0cmlidXRlKFwid2Via2l0LXBsYXlzaW5saW5lXCIsIFwidHJ1ZVwiKVxuXHRcdEBwbGF5ZXIuc2V0QXR0cmlidXRlKFwicHJlbG9hZFwiLCBcImF1dG9cIilcblx0XHRAcGxheWVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCJcblx0XHRAcGxheWVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiXG5cblx0XHRAcGxheWVyLm9uID0gQHBsYXllci5hZGRFdmVudExpc3RlbmVyXG5cdFx0QHBsYXllci5vZmYgPSBAcGxheWVyLnJlbW92ZUV2ZW50TGlzdGVuZXJcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXHRcdCMgRGVmaW5lIGJhc2ljIGNvbnRyb2xzXG5cdFx0QGNvbnRyb2xzID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0d2lkdGg6IDgwLCBoZWlnaHQ6IDgwLCBzdXBlckxheWVyOiBAXG5cdFx0XHRuYW1lOiBcImNvbnRyb2xzXCJcblxuXHRcdEBjb250cm9scy5zaG93UGxheSA9IC0+IEBpbWFnZSA9IFwiaW1hZ2VzL3BsYXkucG5nXCJcblx0XHRAY29udHJvbHMuc2hvd1BhdXNlID0gLT4gQGltYWdlID0gXCJpbWFnZXMvcGF1c2UucG5nXCJcblx0XHRAY29udHJvbHMuc2hvd1BsYXkoKVxuXHRcdEBjb250cm9scy5jZW50ZXIoKVxuXG5cdFx0QHRpbWVTdHlsZSA9IHsgXCJmb250LXNpemVcIjogXCIyMHB4XCIsIFwiY29sb3JcIjogXCIjMDAwXCIgfVxuXG5cdFx0IyBPbiBjbGlja1xuXHRcdEBvbiBFdmVudHMuQ2xpY2ssIC0+XG5cdFx0XHRjdXJyZW50VGltZSA9IE1hdGgucm91bmQoQHBsYXllci5jdXJyZW50VGltZSlcblx0XHRcdGR1cmF0aW9uID0gTWF0aC5yb3VuZChAcGxheWVyLmR1cmF0aW9uKVxuXG5cdFx0XHRpZiBAcGxheWVyLnBhdXNlZFxuXHRcdFx0XHRAcGxheWVyLnBsYXkoKVxuXHRcdFx0XHRAY29udHJvbHMuc2hvd1BhdXNlKClcblxuXHRcdFx0XHRpZiBjdXJyZW50VGltZSBpcyBkdXJhdGlvblxuXHRcdFx0XHRcdEBwbGF5ZXIuY3VycmVudFRpbWUgPSAwXG5cdFx0XHRcdFx0QHBsYXllci5wbGF5KClcblx0XHRcdGVsc2Vcblx0XHRcdFx0QHBsYXllci5wYXVzZSgpXG5cdFx0XHRcdEBjb250cm9scy5zaG93UGxheSgpXG5cblx0XHQjIE9uIGVuZCwgc3dpdGNoIHRvIHBsYXkgYnV0dG9uXG5cdFx0QHBsYXllci5vbnBsYXlpbmcgPSA9PiBAY29udHJvbHMuc2hvd1BhdXNlKClcblx0XHRAcGxheWVyLm9uZW5kZWQgPSA9PiBAY29udHJvbHMuc2hvd1BsYXkoKVxuXG5cdFx0IyBVdGlsc1xuXHRcdEBwbGF5ZXIuZm9ybWF0VGltZSA9IC0+XG5cdFx0XHRzZWMgPSBNYXRoLmZsb29yKEBjdXJyZW50VGltZSlcblx0XHRcdG1pbiA9IE1hdGguZmxvb3Ioc2VjIC8gNjApXG5cdFx0XHRzZWMgPSBNYXRoLmZsb29yKHNlYyAlIDYwKVxuXHRcdFx0c2VjID0gaWYgc2VjID49IDEwIHRoZW4gc2VjIGVsc2UgJzAnICsgc2VjXG5cdFx0XHRyZXR1cm4gXCIje21pbn06I3tzZWN9XCJcblxuXHRcdEBwbGF5ZXIuZm9ybWF0VGltZUxlZnQgPSAtPlxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihAZHVyYXRpb24pIC0gTWF0aC5mbG9vcihAY3VycmVudFRpbWUpXG5cdFx0XHRtaW4gPSBNYXRoLmZsb29yKHNlYyAvIDYwKVxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihzZWMgJSA2MClcblx0XHRcdHNlYyA9IGlmIHNlYyA+PSAxMCB0aGVuIHNlYyBlbHNlICcwJyArIHNlY1xuXHRcdFx0cmV0dXJuIFwiI3ttaW59OiN7c2VjfVwiXG5cblx0XHRAYXVkaW8gPSBvcHRpb25zLmF1ZGlvXG5cdFx0QF9lbGVtZW50LmFwcGVuZENoaWxkKEBwbGF5ZXIpXG5cblx0QGRlZmluZSBcImF1ZGlvXCIsXG5cdFx0Z2V0OiAtPiBAcGxheWVyLnNyY1xuXHRcdHNldDogKGF1ZGlvKSAtPlxuXHRcdFx0QHBsYXllci5zcmMgPSBhdWRpb1xuXHRcdFx0aWYgQHBsYXllci5jYW5QbGF5VHlwZShcImF1ZGlvL21wM1wiKSA9PSBcIlwiXG5cdFx0XHRcdHRocm93IEVycm9yIFwiTm8gc3VwcG9ydGVkIGF1ZGlvIGZpbGUgaW5jbHVkZWQuXCJcblxuXHRAZGVmaW5lIFwic2hvd1Byb2dyZXNzXCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dQcm9ncmVzc1xuXHRcdHNldDogKHNob3dQcm9ncmVzcykgLT4gQHNldFByb2dyZXNzKHNob3dQcm9ncmVzcywgZmFsc2UpXG5cblx0QGRlZmluZSBcInNob3dWb2x1bWVcIixcblx0XHRnZXQ6IC0+IEBfc2hvd1ZvbHVtZVxuXHRcdHNldDogKHNob3dWb2x1bWUpIC0+IEBzZXRWb2x1bWUoc2hvd1ZvbHVtZSwgZmFsc2UpXG5cblx0QGRlZmluZSBcInNob3dUaW1lXCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dUaW1lXG5cdFx0c2V0OiAoc2hvd1RpbWUpIC0+IEBnZXRUaW1lKHNob3dUaW1lLCBmYWxzZSlcblxuXHRAZGVmaW5lIFwic2hvd1RpbWVMZWZ0XCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dUaW1lTGVmdFxuXHRcdHNldDogKHNob3dUaW1lTGVmdCkgLT4gQGdldFRpbWVMZWZ0KHNob3dUaW1lTGVmdCwgZmFsc2UpXG5cblx0IyBDaGVja3MgYSBwcm9wZXJ0eSwgcmV0dXJucyBcInRydWVcIiBvciBcImZhbHNlXCJcblx0X2NoZWNrQm9vbGVhbjogKHByb3BlcnR5KSAtPlxuXHRcdGlmIF8uaXNTdHJpbmcocHJvcGVydHkpXG5cdFx0XHRpZiBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpIGluIFtcIjFcIiwgXCJ0cnVlXCJdXG5cdFx0XHRcdHByb3BlcnR5ID0gdHJ1ZVxuXHRcdFx0ZWxzZSBpZiBwcm9wZXJ0eS50b0xvd2VyQ2FzZSgpIGluIFtcIjBcIiwgXCJmYWxzZVwiXVxuXHRcdFx0XHRwcm9wZXJ0eSA9IGZhbHNlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVyblxuXHRcdGlmIG5vdCBfLmlzQm9vbGVhbihwcm9wZXJ0eSkgdGhlbiByZXR1cm5cblxuXHRnZXRUaW1lOiAoc2hvd1RpbWUpIC0+XG5cdFx0QF9jaGVja0Jvb2xlYW4oc2hvd1RpbWUpXG5cdFx0QF9zaG93VGltZSA9IHNob3dUaW1lXG5cblx0XHRpZiBzaG93VGltZSBpcyB0cnVlXG5cdFx0XHRAdGltZSA9IG5ldyBMYXllclxuXHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwidHJhbnNwYXJlbnRcIlxuXHRcdFx0XHRuYW1lOiBcImN1cnJlbnRUaW1lXCJcblxuXHRcdFx0QHRpbWUuc3R5bGUgPSBAdGltZVN0eWxlXG5cdFx0XHRAdGltZS5odG1sID0gXCIwOjAwXCJcblxuXHRcdFx0QHBsYXllci5vbnRpbWV1cGRhdGUgPSA9PlxuXHRcdFx0XHRAdGltZS5odG1sID0gQHBsYXllci5mb3JtYXRUaW1lKClcblxuXHRnZXRUaW1lTGVmdDogKHNob3dUaW1lTGVmdCkgPT5cblx0XHRAX2NoZWNrQm9vbGVhbihzaG93VGltZUxlZnQpXG5cdFx0QF9zaG93VGltZUxlZnQgPSBzaG93VGltZUxlZnRcblxuXHRcdGlmIHNob3dUaW1lTGVmdCBpcyB0cnVlXG5cdFx0XHRAdGltZUxlZnQgPSBuZXcgTGF5ZXJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdFx0bmFtZTogXCJ0aW1lTGVmdFwiXG5cblx0XHRcdEB0aW1lTGVmdC5zdHlsZSA9IEB0aW1lU3R5bGVcblxuXHRcdFx0IyBTZXQgdGltZUxlZnRcblx0XHRcdEB0aW1lTGVmdC5odG1sID0gXCItMDowMFwiXG5cdFx0XHRAcGxheWVyLm9uIFwibG9hZGVkbWV0YWRhdGFcIiwgPT5cblx0XHRcdFx0QHRpbWVMZWZ0Lmh0bWwgPSBcIi1cIiArIEBwbGF5ZXIuZm9ybWF0VGltZUxlZnQoKVxuXG5cdFx0XHRAcGxheWVyLm9udGltZXVwZGF0ZSA9ID0+XG5cdFx0XHRcdEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAcGxheWVyLmZvcm1hdFRpbWVMZWZ0KClcblxuXHRzZXRQcm9ncmVzczogKHNob3dQcm9ncmVzcykgLT5cblx0XHRAX2NoZWNrQm9vbGVhbihzaG93UHJvZ3Jlc3MpXG5cblx0XHQjIFNldCBhcmd1bWVudCAoc2hvd1Byb2dyZXNzIGlzIGVpdGhlciB0cnVlIG9yIGZhbHNlKVxuXHRcdEBfc2hvd1Byb2dyZXNzID0gc2hvd1Byb2dyZXNzXG5cblx0XHRpZiBAX3Nob3dQcm9ncmVzcyBpcyB0cnVlXG5cblx0XHRcdCMgQ3JlYXRlIFByb2dyZXNzIEJhciArIERlZmF1bHRzXG5cdFx0XHRAcHJvZ3Jlc3NCYXIgPSBuZXcgU2xpZGVyQ29tcG9uZW50XG5cdFx0XHRcdHdpZHRoOiAyMDAsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBcIiNlZWVcIlxuXHRcdFx0XHRrbm9iU2l6ZTogMjAsIHZhbHVlOiAwLCBtaW46IDBcblxuXHRcdFx0QHBsYXllci5vbmNhbnBsYXkgPSA9PiBAcHJvZ3Jlc3NCYXIubWF4ID0gTWF0aC5yb3VuZChAcGxheWVyLmR1cmF0aW9uKVxuXHRcdFx0QHByb2dyZXNzQmFyLmtub2IuZHJhZ2dhYmxlLm1vbWVudHVtID0gZmFsc2VcblxuXHRcdFx0IyBDaGVjayBpZiB0aGUgcGxheWVyIHdhcyBwbGF5aW5nXG5cdFx0XHR3YXNQbGF5aW5nID0gaXNNb3ZpbmcgPSBmYWxzZVxuXHRcdFx0dW5sZXNzIEBwbGF5ZXIucGF1c2VkIHRoZW4gd2FzUGxheWluZyA9IHRydWVcblxuXHRcdFx0QHByb2dyZXNzQmFyLm9uIFwiY2hhbmdlOnZhbHVlXCIsID0+XG5cdFx0XHRcdEBwbGF5ZXIuY3VycmVudFRpbWUgPSBAcHJvZ3Jlc3NCYXIudmFsdWVcblxuXHRcdFx0XHRpZiBAdGltZSBhbmQgQHRpbWVMZWZ0XG5cdFx0XHRcdFx0QHRpbWUuaHRtbCA9IEBwbGF5ZXIuZm9ybWF0VGltZSgpXG5cdFx0XHRcdFx0QHRpbWVMZWZ0Lmh0bWwgPSBcIi1cIiArIEBwbGF5ZXIuZm9ybWF0VGltZUxlZnQoKVxuXG5cdFx0XHRAcHJvZ3Jlc3NCYXIua25vYi5vbiBFdmVudHMuRHJhZ01vdmUsID0+IGlzTW92aW5nID0gdHJ1ZVxuXG5cdFx0XHRAcHJvZ3Jlc3NCYXIua25vYi5vbiBFdmVudHMuRHJhZ0VuZCwgKGV2ZW50KSA9PlxuXHRcdFx0XHRjdXJyZW50VGltZSA9IE1hdGgucm91bmQoQHBsYXllci5jdXJyZW50VGltZSlcblx0XHRcdFx0ZHVyYXRpb24gPSBNYXRoLnJvdW5kKEBwbGF5ZXIuZHVyYXRpb24pXG5cblx0XHRcdFx0aWYgd2FzUGxheWluZyBhbmQgY3VycmVudFRpbWUgaXNudCBkdXJhdGlvblxuXHRcdFx0XHRcdEBwbGF5ZXIucGxheSgpXG5cdFx0XHRcdFx0QGNvbnRyb2xzLnNob3dQYXVzZSgpXG5cblx0XHRcdFx0aWYgY3VycmVudFRpbWUgaXMgZHVyYXRpb25cblx0XHRcdFx0XHRAcGxheWVyLnBhdXNlKClcblx0XHRcdFx0XHRAY29udHJvbHMuc2hvd1BsYXkoKVxuXG5cdFx0XHRcdHJldHVybiBpc01vdmluZyA9IGZhbHNlXG5cblx0XHRcdCMgVXBkYXRlIFByb2dyZXNzXG5cdFx0XHRAcGxheWVyLm9udGltZXVwZGF0ZSA9ID0+XG5cdFx0XHRcdHVubGVzcyBpc01vdmluZ1xuXHRcdFx0XHRcdEBwcm9ncmVzc0Jhci5rbm9iLm1pZFggPSBAcHJvZ3Jlc3NCYXIucG9pbnRGb3JWYWx1ZShAcGxheWVyLmN1cnJlbnRUaW1lKVxuXHRcdFx0XHRcdEBwcm9ncmVzc0Jhci5rbm9iLmRyYWdnYWJsZS5pc01vdmluZyA9IGZhbHNlXG5cblx0XHRcdFx0aWYgQHRpbWUgYW5kIEB0aW1lTGVmdFxuXHRcdFx0XHRcdEB0aW1lLmh0bWwgPSBAcGxheWVyLmZvcm1hdFRpbWUoKVxuXHRcdFx0XHRcdEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAcGxheWVyLmZvcm1hdFRpbWVMZWZ0KClcblxuXHRzZXRWb2x1bWU6IChzaG93Vm9sdW1lKSAtPlxuXHRcdEBfY2hlY2tCb29sZWFuKHNob3dWb2x1bWUpXG5cblx0XHQjIFNldCBkZWZhdWx0IHRvIDc1JVxuXHRcdEBwbGF5ZXIudm9sdW1lID89IDAuNzVcblxuXHRcdEB2b2x1bWVCYXIgPSBuZXcgU2xpZGVyQ29tcG9uZW50XG5cdFx0XHR3aWR0aDogMjAwLCBoZWlnaHQ6IDZcblx0XHRcdGJhY2tncm91bmRDb2xvcjogXCIjZWVlXCJcblx0XHRcdGtub2JTaXplOiAyMFxuXHRcdFx0bWluOiAwLCBtYXg6IDFcblx0XHRcdHZhbHVlOiBAcGxheWVyLnZvbHVtZVxuXG5cdFx0QHZvbHVtZUJhci5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cblx0XHRAdm9sdW1lQmFyLm9uIFwiY2hhbmdlOndpZHRoXCIsID0+XG5cdFx0XHRAdm9sdW1lQmFyLnZhbHVlID0gQHBsYXllci52b2x1bWVcblxuXHRcdEB2b2x1bWVCYXIub24gXCJjaGFuZ2U6dmFsdWVcIiwgPT5cblx0XHRcdEBwbGF5ZXIudm9sdW1lID0gQHZvbHVtZUJhci52YWx1ZVxuIl19
