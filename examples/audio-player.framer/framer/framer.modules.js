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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmVuL0RvY3VtZW50cy9EZXNpZ24vRnJhbWVyTGl2ZS9GcmFtZXItQXVkaW9QbGF5ZXIvZXhhbXBsZXMvYXVkaW8tcGxheWVyLmZyYW1lci9tb2R1bGVzL2F1ZGlvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7Ozs7QUFBTSxPQUFPLENBQUM7OztFQUVBLHFCQUFDLE9BQUQ7O01BQUMsVUFBUTs7OztNQUNyQixPQUFPLENBQUMsa0JBQW1COztJQUczQixJQUFDLENBQUEsTUFBRCxHQUFVLFFBQVEsQ0FBQyxhQUFULENBQXVCLE9BQXZCO0lBQ1YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLG9CQUFyQixFQUEyQyxNQUEzQztJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBUixDQUFxQixTQUFyQixFQUFnQyxNQUFoQztJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQWQsR0FBc0I7SUFDdEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBZCxHQUF1QjtJQUV2QixJQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDO0lBQ3JCLElBQUMsQ0FBQSxNQUFNLENBQUMsR0FBUixHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUM7SUFFdEIsNkNBQU0sT0FBTjtJQUdBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsS0FBQSxDQUNmO01BQUEsZUFBQSxFQUFpQixhQUFqQjtNQUNBLEtBQUEsRUFBTyxFQURQO01BQ1csTUFBQSxFQUFRLEVBRG5CO01BQ3VCLFVBQUEsRUFBWSxJQURuQztNQUVBLElBQUEsRUFBTSxVQUZOO0tBRGU7SUFLaEIsSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUFWLEdBQXFCLFNBQUE7YUFBRyxJQUFDLENB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LElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsZUFBQSxDQUNoQjtNQUFBLEtBQUEsRUFBTyxHQUFQO01BQVksTUFBQSxFQUFRLENBQXBCO01BQ0EsZUFBQSxFQUFpQixNQURqQjtNQUVBLFFBQUEsRUFBVSxFQUZWO01BR0EsR0FBQSxFQUFLLENBSEw7TUFHUSxHQUFBLEVBQUssQ0FIYjtNQUlBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BSmY7S0FEZ0I7SUFPakIsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQTFCLEdBQXFDO0lBRXJDLElBQUMsQ0FBQSxTQUFTLENBQUMsRUFBWCxDQUFjLGNBQWQsRUFBOEIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO2VBQzdCLEtBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxHQUFtQixLQUFDLENBQUEsTUFBTSxDQUFDO01BREU7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCO1dBR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxFQUFYLENBQWMsY0FBZCxFQUE4QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7ZUFDN0IsS0FBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLEtBQUMsQ0FBQSxTQUFTLENBQUM7TUFEQztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7RUFsQlU7Ozs7R0E3THNCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuQXVkaW9QbGF5ZXIgZXh0ZW5kcyBMYXllclxuXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcInRyYW5zcGFyZW50XCJcblxuXHRcdCMgRGVmaW5lIHBsYXllclxuXHRcdEBwbGF5ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIilcblx0XHRAcGxheWVyLnNldEF0dHJpYnV0ZShcIndlYmtpdC1wbGF5c2lubGluZVwiLCBcInRydWVcIilcblx0XHRAcGxheWVyLnNldEF0dHJpYnV0ZShcInByZWxvYWRcIiwgXCJhdXRvXCIpXG5cdFx0QHBsYXllci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiXG5cdFx0QHBsYXllci5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIlxuXG5cdFx0QHBsYXllci5vbiA9IEBwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lclxuXHRcdEBwbGF5ZXIub2ZmID0gQHBsYXllci5yZW1vdmVFdmVudExpc3RlbmVyXG5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHQjIERlZmluZSBiYXNpYyBjb250cm9sc1xuXHRcdEBjb250cm9scyA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdHdpZHRoOiA4MCwgaGVpZ2h0OiA4MCwgc3VwZXJMYXllcjogQFxuXHRcdFx0bmFtZTogXCJjb250cm9sc1wiXG5cblx0XHRAY29udHJvbHMuc2hvd1BsYXkgPSAtPiBAaW1hZ2UgPSBcImltYWdlcy9wbGF5LnBuZ1wiXG5cdFx0QGNvbnRyb2xzLnNob3dQYXVzZSA9IC0+IEBpbWFnZSA9IFwiaW1hZ2VzL3BhdXNlLnBuZ1wiXG5cdFx0QGNvbnRyb2xzLnNob3dQbGF5KClcblx0XHRAY29udHJvbHMuY2VudGVyKClcblxuXHRcdEB0aW1lU3R5bGUgPSB7IFwiZm9udC1zaXplXCI6IFwiMjBweFwiLCBcImNvbG9yXCI6IFwiIzAwMFwiIH1cblxuXHRcdCMgT24gY2xpY2tcblx0XHRAb24gRXZlbnRzLkNsaWNrLCAtPlxuXHRcdFx0Y3VycmVudFRpbWUgPSBNYXRoLnJvdW5kKEBwbGF5ZXIuY3VycmVudFRpbWUpXG5cdFx0XHRkdXJhdGlvbiA9IE1hdGgucm91bmQoQHBsYXllci5kdXJhdGlvbilcblxuXHRcdFx0aWYgQHBsYXllci5wYXVzZWRcblx0XHRcdFx0QHBsYXllci5wbGF5KClcblx0XHRcdFx0QGNvbnRyb2xzLnNob3dQYXVzZSgpXG5cblx0XHRcdFx0aWYgY3VycmVudFRpbWUgaXMgZHVyYXRpb25cblx0XHRcdFx0XHRAcGxheWVyLmN1cnJlbnRUaW1lID0gMFxuXHRcdFx0XHRcdEBwbGF5ZXIucGxheSgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEBwbGF5ZXIucGF1c2UoKVxuXHRcdFx0XHRAY29udHJvbHMuc2hvd1BsYXkoKVxuXG5cdFx0IyBPbiBlbmQsIHN3aXRjaCB0byBwbGF5IGJ1dHRvblxuXHRcdEBwbGF5ZXIub25wbGF5aW5nID0gPT4gQGNvbnRyb2xzLnNob3dQYXVzZSgpXG5cdFx0QHBsYXllci5vbmVuZGVkID0gPT4gQGNvbnRyb2xzLnNob3dQbGF5KClcblxuXHRcdCMgVXRpbHNcblx0XHRAcGxheWVyLmZvcm1hdFRpbWUgPSAtPlxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihAY3VycmVudFRpbWUpXG5cdFx0XHRtaW4gPSBNYXRoLmZsb29yKHNlYyAvIDYwKVxuXHRcdFx0c2VjID0gTWF0aC5mbG9vcihzZWMgJSA2MClcblx0XHRcdHNlYyA9IGlmIHNlYyA+PSAxMCB0aGVuIHNlYyBlbHNlICcwJyArIHNlY1xuXHRcdFx0cmV0dXJuIFwiI3ttaW59OiN7c2VjfVwiXG5cblx0XHRAcGxheWVyLmZvcm1hdFRpbWVMZWZ0ID0gLT5cblx0XHRcdHNlYyA9IE1hdGguZmxvb3IoQGR1cmF0aW9uKSAtIE1hdGguZmxvb3IoQGN1cnJlbnRUaW1lKVxuXHRcdFx0bWluID0gTWF0aC5mbG9vcihzZWMgLyA2MClcblx0XHRcdHNlYyA9IE1hdGguZmxvb3Ioc2VjICUgNjApXG5cdFx0XHRzZWMgPSBpZiBzZWMgPj0gMTAgdGhlbiBzZWMgZWxzZSAnMCcgKyBzZWNcblx0XHRcdHJldHVybiBcIiN7bWlufToje3NlY31cIlxuXG5cdFx0QGF1ZGlvID0gb3B0aW9ucy5hdWRpb1xuXHRcdEBfZWxlbWVudC5hcHBlbmRDaGlsZChAcGxheWVyKVxuXG5cdEBkZWZpbmUgXCJhdWRpb1wiLFxuXHRcdGdldDogLT4gQHBsYXllci5zcmNcblx0XHRzZXQ6IChhdWRpbykgLT5cblx0XHRcdEBwbGF5ZXIuc3JjID0gYXVkaW9cblx0XHRcdGlmIEBwbGF5ZXIuY2FuUGxheVR5cGUoXCJhdWRpby9tcDNcIikgPT0gXCJcIlxuXHRcdFx0XHR0aHJvdyBFcnJvciBcIk5vIHN1cHBvcnRlZCBhdWRpbyBmaWxlIGluY2x1ZGVkLlwiXG5cblx0QGRlZmluZSBcInNob3dQcm9ncmVzc1wiLFxuXHRcdGdldDogLT4gQF9zaG93UHJvZ3Jlc3Ncblx0XHRzZXQ6IChzaG93UHJvZ3Jlc3MpIC0+IEBzZXRQcm9ncmVzcyhzaG93UHJvZ3Jlc3MsIGZhbHNlKVxuXG5cdEBkZWZpbmUgXCJzaG93Vm9sdW1lXCIsXG5cdFx0Z2V0OiAtPiBAX3Nob3dWb2x1bWVcblx0XHRzZXQ6IChzaG93Vm9sdW1lKSAtPiBAc2V0Vm9sdW1lKHNob3dWb2x1bWUsIGZhbHNlKVxuXG5cdEBkZWZpbmUgXCJzaG93VGltZVwiLFxuXHRcdGdldDogLT4gQF9zaG93VGltZVxuXHRcdHNldDogKHNob3dUaW1lKSAtPiBAZ2V0VGltZShzaG93VGltZSwgZmFsc2UpXG5cblx0QGRlZmluZSBcInNob3dUaW1lTGVmdFwiLFxuXHRcdGdldDogLT4gQF9zaG93VGltZUxlZnRcblx0XHRzZXQ6IChzaG93VGltZUxlZnQpIC0+IEBnZXRUaW1lTGVmdChzaG93VGltZUxlZnQsIGZhbHNlKVxuXG5cdCMgQ2hlY2tzIGEgcHJvcGVydHksIHJldHVybnMgXCJ0cnVlXCIgb3IgXCJmYWxzZVwiXG5cdF9jaGVja0Jvb2xlYW46IChwcm9wZXJ0eSkgLT5cblx0XHRpZiBfLmlzU3RyaW5nKHByb3BlcnR5KVxuXHRcdFx0aWYgcHJvcGVydHkudG9Mb3dlckNhc2UoKSBpbiBbXCIxXCIsIFwidHJ1ZVwiXVxuXHRcdFx0XHRwcm9wZXJ0eSA9IHRydWVcblx0XHRcdGVsc2UgaWYgcHJvcGVydHkudG9Mb3dlckNhc2UoKSBpbiBbXCIwXCIsIFwiZmFsc2VcIl1cblx0XHRcdFx0cHJvcGVydHkgPSBmYWxzZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm5cblx0XHRpZiBub3QgXy5pc0Jvb2xlYW4ocHJvcGVydHkpIHRoZW4gcmV0dXJuXG5cblx0Z2V0VGltZTogKHNob3dUaW1lKSAtPlxuXHRcdEBfY2hlY2tCb29sZWFuKHNob3dUaW1lKVxuXHRcdEBfc2hvd1RpbWUgPSBzaG93VGltZVxuXG5cdFx0aWYgc2hvd1RpbWUgaXMgdHJ1ZVxuXHRcdFx0QHRpbWUgPSBuZXcgTGF5ZXJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiBcInRyYW5zcGFyZW50XCJcblx0XHRcdFx0bmFtZTogXCJjdXJyZW50VGltZVwiXG5cblx0XHRcdEB0aW1lLnN0eWxlID0gQHRpbWVTdHlsZVxuXHRcdFx0QHRpbWUuaHRtbCA9IFwiMDowMFwiXG5cblx0XHRcdEBwbGF5ZXIub250aW1ldXBkYXRlID0gPT5cblx0XHRcdFx0QHRpbWUuaHRtbCA9IEBwbGF5ZXIuZm9ybWF0VGltZSgpXG5cblx0Z2V0VGltZUxlZnQ6IChzaG93VGltZUxlZnQpID0+XG5cdFx0QF9jaGVja0Jvb2xlYW4oc2hvd1RpbWVMZWZ0KVxuXHRcdEBfc2hvd1RpbWVMZWZ0ID0gc2hvd1RpbWVMZWZ0XG5cblx0XHRpZiBzaG93VGltZUxlZnQgaXMgdHJ1ZVxuXHRcdFx0QHRpbWVMZWZ0ID0gbmV3IExheWVyXG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiXG5cdFx0XHRcdG5hbWU6IFwidGltZUxlZnRcIlxuXG5cdFx0XHRAdGltZUxlZnQuc3R5bGUgPSBAdGltZVN0eWxlXG5cblx0XHRcdCMgU2V0IHRpbWVMZWZ0XG5cdFx0XHRAdGltZUxlZnQuaHRtbCA9IFwiLTA6MDBcIlxuXHRcdFx0QHBsYXllci5vbiBcImxvYWRlZG1ldGFkYXRhXCIsID0+XG5cdFx0XHRcdEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAcGxheWVyLmZvcm1hdFRpbWVMZWZ0KClcblxuXHRcdFx0QHBsYXllci5vbnRpbWV1cGRhdGUgPSA9PlxuXHRcdFx0XHRAdGltZUxlZnQuaHRtbCA9IFwiLVwiICsgQHBsYXllci5mb3JtYXRUaW1lTGVmdCgpXG5cblx0c2V0UHJvZ3Jlc3M6IChzaG93UHJvZ3Jlc3MpIC0+XG5cdFx0QF9jaGVja0Jvb2xlYW4oc2hvd1Byb2dyZXNzKVxuXG5cdFx0IyBTZXQgYXJndW1lbnQgKHNob3dQcm9ncmVzcyBpcyBlaXRoZXIgdHJ1ZSBvciBmYWxzZSlcblx0XHRAX3Nob3dQcm9ncmVzcyA9IHNob3dQcm9ncmVzc1xuXG5cdFx0aWYgQF9zaG93UHJvZ3Jlc3MgaXMgdHJ1ZVxuXG5cdFx0XHQjIENyZWF0ZSBQcm9ncmVzcyBCYXIgKyBEZWZhdWx0c1xuXHRcdFx0QHByb2dyZXNzQmFyID0gbmV3IFNsaWRlckNvbXBvbmVudFxuXHRcdFx0XHR3aWR0aDogMjAwLCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogXCIjZWVlXCJcblx0XHRcdFx0a25vYlNpemU6IDIwLCB2YWx1ZTogMCwgbWluOiAwXG5cblx0XHRcdEBwbGF5ZXIub25jYW5wbGF5ID0gPT4gQHByb2dyZXNzQmFyLm1heCA9IE1hdGgucm91bmQoQHBsYXllci5kdXJhdGlvbilcblx0XHRcdEBwcm9ncmVzc0Jhci5rbm9iLmRyYWdnYWJsZS5tb21lbnR1bSA9IGZhbHNlXG5cblx0XHRcdCMgQ2hlY2sgaWYgdGhlIHBsYXllciB3YXMgcGxheWluZ1xuXHRcdFx0d2FzUGxheWluZyA9IGlzTW92aW5nID0gZmFsc2Vcblx0XHRcdHVubGVzcyBAcGxheWVyLnBhdXNlZCB0aGVuIHdhc1BsYXlpbmcgPSB0cnVlXG5cblx0XHRcdEBwcm9ncmVzc0Jhci5vbiBcImNoYW5nZTp2YWx1ZVwiLCA9PlxuXHRcdFx0XHRAcGxheWVyLmN1cnJlbnRUaW1lID0gQHByb2dyZXNzQmFyLnZhbHVlXG5cblx0XHRcdFx0aWYgQHRpbWUgYW5kIEB0aW1lTGVmdFxuXHRcdFx0XHRcdEB0aW1lLmh0bWwgPSBAcGxheWVyLmZvcm1hdFRpbWUoKVxuXHRcdFx0XHRcdEB0aW1lTGVmdC5odG1sID0gXCItXCIgKyBAcGxheWVyLmZvcm1hdFRpbWVMZWZ0KClcblxuXHRcdFx0QHByb2dyZXNzQmFyLmtub2Iub24gRXZlbnRzLkRyYWdNb3ZlLCA9PiBpc01vdmluZyA9IHRydWVcblxuXHRcdFx0QHByb2dyZXNzQmFyLmtub2Iub24gRXZlbnRzLkRyYWdFbmQsIChldmVudCkgPT5cblx0XHRcdFx0Y3VycmVudFRpbWUgPSBNYXRoLnJvdW5kKEBwbGF5ZXIuY3VycmVudFRpbWUpXG5cdFx0XHRcdGR1cmF0aW9uID0gTWF0aC5yb3VuZChAcGxheWVyLmR1cmF0aW9uKVxuXG5cdFx0XHRcdGlmIHdhc1BsYXlpbmcgYW5kIGN1cnJlbnRUaW1lIGlzbnQgZHVyYXRpb25cblx0XHRcdFx0XHRAcGxheWVyLnBsYXkoKVxuXHRcdFx0XHRcdEBjb250cm9scy5zaG93UGF1c2UoKVxuXG5cdFx0XHRcdGlmIGN1cnJlbnRUaW1lIGlzIGR1cmF0aW9uXG5cdFx0XHRcdFx0QHBsYXllci5wYXVzZSgpXG5cdFx0XHRcdFx0QGNvbnRyb2xzLnNob3dQbGF5KClcblxuXHRcdFx0XHRyZXR1cm4gaXNNb3ZpbmcgPSBmYWxzZVxuXG5cdFx0XHQjIFVwZGF0ZSBQcm9ncmVzc1xuXHRcdFx0QHBsYXllci5vbnRpbWV1cGRhdGUgPSA9PlxuXHRcdFx0XHR1bmxlc3MgaXNNb3Zpbmdcblx0XHRcdFx0XHRAcHJvZ3Jlc3NCYXIua25vYi5taWRYID0gQHByb2dyZXNzQmFyLnBvaW50Rm9yVmFsdWUoQHBsYXllci5jdXJyZW50VGltZSlcblx0XHRcdFx0XHRAcHJvZ3Jlc3NCYXIua25vYi5kcmFnZ2FibGUuaXNNb3ZpbmcgPSBmYWxzZVxuXG5cdFx0XHRcdGlmIEB0aW1lIGFuZCBAdGltZUxlZnRcblx0XHRcdFx0XHRAdGltZS5odG1sID0gQHBsYXllci5mb3JtYXRUaW1lKClcblx0XHRcdFx0XHRAdGltZUxlZnQuaHRtbCA9IFwiLVwiICsgQHBsYXllci5mb3JtYXRUaW1lTGVmdCgpXG5cblx0c2V0Vm9sdW1lOiAoc2hvd1ZvbHVtZSkgLT5cblx0XHRAX2NoZWNrQm9vbGVhbihzaG93Vm9sdW1lKVxuXG5cdFx0IyBTZXQgZGVmYXVsdCB0byA3NSVcblx0XHRAcGxheWVyLnZvbHVtZSA/PSAwLjc1XG5cblx0XHRAdm9sdW1lQmFyID0gbmV3IFNsaWRlckNvbXBvbmVudFxuXHRcdFx0d2lkdGg6IDIwMCwgaGVpZ2h0OiA2XG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IFwiI2VlZVwiXG5cdFx0XHRrbm9iU2l6ZTogMjBcblx0XHRcdG1pbjogMCwgbWF4OiAxXG5cdFx0XHR2YWx1ZTogQHBsYXllci52b2x1bWVcblxuXHRcdEB2b2x1bWVCYXIua25vYi5kcmFnZ2FibGUubW9tZW50dW0gPSBmYWxzZVxuXG5cdFx0QHZvbHVtZUJhci5vbiBcImNoYW5nZTp3aWR0aFwiLCA9PlxuXHRcdFx0QHZvbHVtZUJhci52YWx1ZSA9IEBwbGF5ZXIudm9sdW1lXG5cblx0XHRAdm9sdW1lQmFyLm9uIFwiY2hhbmdlOnZhbHVlXCIsID0+XG5cdFx0XHRAcGxheWVyLnZvbHVtZSA9IEB2b2x1bWVCYXIudmFsdWVcbiJdfQ==
