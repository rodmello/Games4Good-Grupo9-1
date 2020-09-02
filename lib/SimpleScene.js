class SimpleScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init() {
    this.add.key = this.addKey.bind(this);
    this.add.timer = this.addTimer.bind(this);
  }

  //addText allows you to set the color as a parameter
  //-defuzz()  aligns text so it is not on a half pixel which creates blur
  //-bold() makes the text bold
  addText(x, y, text, color, style) {
    if (color !== undefined) {
      color = getHexColor("#", color);
    }
    else {
      color = "#FFFFFF";
    }
    var custom_style = {
      //fontfamily: `Inconsolata, monospace`,
      fontFamily: foundation_fonts,
      fill: color,
      color: color,
      stroke: color,
    };
    if (style) {
      Object.assign(custom_style, style);
    }

    var obj = this.add.text(x, y, text, custom_style);
    obj._color = color;

    obj.defuzz = function () {
      obj.displayOriginX = Math.round(obj.displayOriginX);
      obj.displayOriginY = Math.round(obj.displayOriginY);
      obj.depth = 1;
      return obj;
    };

    obj.setFontColor = function (color) {
      color = getHexColor("#", color);
      obj.setColor(color);
      obj.setFill(color);
    }

    obj.bold = function (weight) {
      obj.setStroke(obj._color, weight != undefined ? weight : .8);
      return obj;
    }
    return obj;
  }

  //addkey() - creates a new key Object
  //-wasPressed() checks for single press down
  //-isDown() checks for a continuous press down
  //-wasReleased() checks for single release of key
  //-getDuration() gets the duration of the key press
  //-enable() and disable() available
  addKey(keyId, enableCapture) {
    var obj = {};
    obj._down = false;
    obj._justPressed = false;
    obj._justReleased = false;
    this.removeKey(keyId);
    if (enableCapture == undefined) { enableCapture = true };
    obj.key = this.input.keyboard.addKey(keyId, enableCapture);

    obj.key.on('down', function () {
      obj._justPressed = true;
      obj._down = true;
    });

    obj.key.on('up', function () {
      obj._justReleased = true;
      obj._down = false;
    });

    obj.onDown = function (method, context) {
      obj.key.on('down', method, context);
    }

    obj.isDown = function () {
      return obj._down;
    };

    obj.wasPressed = function () {
      if (this._justPressed) {
        this._justPressed = false;
        return true;
      }
      return false;
    };

    obj.wasReleased = function () {
      if (this._justReleased) {
        this._justReleased = false;
        return true;
      }
      return false;
    };

    obj.getDuration = function () {
      return obj.key.getDuration();
    };

    obj.enable = function () {
      obj.key.enabled = true;
      return obj;
    };

    obj.disable = function () {
      obj.key.enabled = false;
      return obj;
    };

    obj.shiftPressed = function () {
      return obj.key.shiftKey;
    }

    return obj;
  }

  removeKey(key) {
    this.input.keyboard.removeKey(key);
    this.input.keyboard.removeCapture(key);
  }
  //enablesClick - does what setInteractive does but more
  // you can pass a method as an optional paramter which will be performed on pointer down
  // -wasClicked() checks if a single press down happened
  // -wasReleased() checks if click was released
  // -isDown() checks for a continous hold down
  // -isOver() checks if the mouse is over the Object
  enableClick(obj, onClick) {
    obj.setInteractive();
    obj._justClicked = false;
    obj._justReleased = false;
    obj._pointerOver = false;

    obj.wasClicked = function () {
      if (this._justClicked) {
        this._justClicked = false;
        return true;
      }
      return false;
    };

    obj.wasReleased = function () {
      if (this._justReleased) {
        this._justReleased = false;
        return true;
      }
      return false;
    };

    obj.isDown = function () {
      return (obj._pointerOver && this.scene.input.activePointer.isDown)
    };

    obj.isOver = function () {
      return obj._pointerOver;
    }

    obj.disable = function () {
      return obj.disableInteractive();
    }

    obj.enable = function () {
      return obj.setInteractive();
    }

    obj.on('pointerover', function (pointer) {
      this._pointerOver = true;
    }, obj);

    obj.on('pointerout', function (pointer) {
      this._pointerOver = false;
    }, obj);

    obj.on("pointerdown", function (pointer) {
      this._justClicked = true;
    }, obj);

    obj.on("pointerup", function (pointer) {
      this._justReleased = true;
    }, obj);

    if (onClick) {
      obj.on("pointerdown", onClick, this);
    }
  }

  disableClick(obj) {
    obj.disableInteractive();
  }

  //enableDrag() enables dragging of an Object
  //-isDragging() checks if the object is currently being dragged
  //-wasDropped() checks if the object was dropped
  enableDrag(obj) {
    obj.setInteractive();

    obj.dropped = false;
    obj.dragging = false;
    obj.scene.input.setDraggable(obj);
    obj.on('dragstart', function (pointer) {
      obj.dropped = false;
      obj.dragging = true;
    });
    obj.on('drag', function (pointer, dragX, dragY) {
      obj.setPosition(dragX, dragY);
    });
    obj.on('dragend', function (pointer) {
      obj.dragging = false;
      obj.dropped = true;
    });

    obj.isDragging = function () {
      return obj.dragging;
    };

    obj.wasDropped = function () {
      if (obj.dropped) {
        obj.dropped = false;
        return true;
      }
      return false;
    };
  }

  disableDrag(obj) {
    obj.scene.input.setDraggable(obj, false);
  }

  // display the pointer coordinates live on the screen
  showLiveCoordinates() {
    this.liveCoordinates = this.add.text(0, 0, "(0, 0)").setOrigin(0, 1);
    this.liveCoordinates.alpha = 0.8;
    this.liveCoordinates.depth = 200;

    this.input.on('pointermove', function (pointer) {
      pointer = this.getPointer();
      this.liveCoordinates.x = pointer.getX();
      this.liveCoordinates.y = pointer.getY();
      let text = `(${Math.round(pointer.getX())}, ${Math.round(pointer.getY())})`;
      this.liveCoordinates.setText(text);
    }, this);
  }

  // draws the origin location on top of the game Object
  // helps students to visualize the origin
  drawOrigin(obj) {
    if (!obj.originDot) {
      obj.originDot = this.add.circle(obj.x, obj.y, 3, 0xFF0000);
    }
    else {
      obj.originDot.x = obj.x;
      obj.originDot.y = obj.y;
    }
    return obj.originDot;
  }

  // draw a grid for reference 
  drawGrid() {
    var w = this.cameras.main.displayWidth;
    var h = this.cameras.main.displayHeight;
    var weight = .5;
    var color = "0xffffff";
    var font = {
      font: "10px Arial",
      fill: "#ffffff",
    };
		let grid = []
    for (var i = 100; i <= w; i += 100) {
      grid.push(this.add.rectangle(i, h / 2, weight, h, color));
      grid.push(this.addText(i, 0, i, 0xFFFFFF, font).setOrigin(.5, 0).defuzz());
    }
    for (var i = 100; i <= h; i += 100) {
      grid.push(this.add.rectangle(w / 2, i, w, weight, color));
      grid.push(this.addText(0, i, i, 0xFFFFFF, font).setOrigin(0, 0.5).defuzz());
    }
		grid.push(this.addText(0, 0, "(0, 0)", 0xFFFFFF, font).defuzz());
		if (this._grid && this._grid.length > 0) {
			for (let obj of this._grid) {
				obj.destroy();
			}
		}
		this._grid = grid;
  }

  //Use this to create a text input that allows new line
  // config options: https://www.w3schools.com/tags/tag_textarea.asp
  addTextArea(x, y, rows, cols, config) {
    var textarea = document.createElement("textarea");
    textarea.rows = rows;
    textarea.cols = cols;
    textarea.spellcheck = false;
    Object.assign(textarea, config);
    let obj = this.add.dom(x, y, textarea);
    obj.setOrigin(0, 0);
    this.addTextToInput(obj, config);

    this.addGetSetValue(obj);
    if (config && config.value != undefined)
      obj.setValue(config.value);
    this.addEnableDisable(obj);

    return obj;
  }

  //(private) Used to create input fields that need standard value getters and setters
  addGetSetValue(obj) {
    obj.getValue = function () {
      return obj.node.value;
    }
    obj.setValue = function (value) {
      obj.node.value = value;
      return obj;
    }
  }

  //(private) Used to create input fields that need standard enable and disable
  addEnableDisable(obj) {
    obj.disable = function () {
      obj.node.disabled = true;
      return obj;
    }
    obj.enable = function () {
      obj.node.disabled = false;
      return obj;
    }
  }


  //(public) Used to create drop down menus
  // option is an array of menu items. config is be true HTML options
  //{text:"text to show", value:"can bet set different from text if needed"}
  addSelectField(x, y, options, config) {
    var s = document.createElement("select");

    for (let i = 0; i < options.length; i++) {
      var o = document.createElement("option");
      Object.assign(o, options[i]);
      s.add(o);
    }
    Object.assign(s, config);
    let obj = this.add.dom(x, y, s);
    obj.setOrigin(0, 0.1);
    this.addTextToInput(obj, config);
    this.addGetSetValue(obj);
    if (config && config.value != undefined) {
      obj.setValue(config.value);
    }
    this.addEnableDisable(obj);


    return obj;
  }

  //User this to create different types of inputs
  //Tested with input types: number, text, range(slider), color
  addInputField(x, y, type, width, config) {

    var el = document.createElement("input");
    el.type = type.toLowerCase();
    el.autocomplete = false;
    el.style = `width: ${width}px;`;
    Object.assign(el, config);
    let obj = this.add.dom(x, y, el);
    obj.setOrigin(0, 0);
    this.addTextToInput(obj, config);

    if (el.type == "number" || el.type == "range") {
      //Numerical input types
      obj.getValue = function () {
        if (obj.node.max != "" && obj.node.value * 1 > obj.node.max * 1) {
          obj.node.value = obj.node.max * 1;
        }
        if (obj.node.min != "" && obj.node.value * 1 < obj.node.min * 1) {
          obj.node.value = obj.node.min * 1;
        }
        return obj.node.value * 1;
      }
    }
    else {
      //Text-based input types
      obj.getValue = function () {
        if (obj.node.type == "color") {
          return "0x" + obj.node.value.trim().substr(1);
        }
        else if (typeof obj.node.value == "string") {
          return obj.node.value.trim();
        }
        return obj.node.value;
      }
    }
    if (el.type == "text") {
      obj.setValue = function (value) {
        obj.node.value = value;
        setTimeout(function(){ obj.node.selectionStart = obj.node.selectionEnd = 10000; }, 0);
        return obj;
      }
    }
    else {
      obj.setValue = function (value) {
        obj.node.value = value;
        return obj;
      }      
    }
    this.addEnableDisable(obj);

    if (config && config.value != undefined) {
      obj.setValue(config.value);
    }

    return obj;
  }

  //(private) This is used to create labels on user input fields
  addTextToInput(obj, config) {
    obj.setLabel = function (text) {
      if (obj.label) {
        obj.label.destroy();
      }
      obj.label = this.scene.addText(obj.x, obj.y, text).setOrigin(1, 0).defuzz();
    }

    if (config == undefined) {
      return;
    }
    if (config.label) {
      obj.setLabel(config.label);
    }
    if (config.posttext) {
      obj.posttext = this.addText(obj.x + obj.width, obj.y, " " + config.posttext).setOrigin(0, 0).defuzz();
    }


  }

  // Create a html overlay component from key 
  // Use this.load.html(key, file) first to create key
  addHtml(x, y, key) {
    var obj = this.add.dom(x, y).createFromCache(key);
    return obj;
  }

  //This still needs some work and testing
  addTimer(ms, count, paused) {
    var loop = true;
    if (count && typeof count == 'number', count > 0) {
      loop = false;
    }
    var config = {
      delay: ms,
      callback: function () { timer.expired = true; },
      callbackScope: this,
      loop: loop,
      repeat: count - 1,
      startAt: 0,
      paused: paused ? true : false
    };

    var timer = this.time.addEvent(config);
    timer.original = config;
    timer.expired = false;

    timer.isUp = function () {
      if (timer.expired) {
        timer.expired = false;
        return true;
      }
      return false;
    }

    timer.pause = function () {
      timer.paused = true;
			return timer;
    };

    timer.unpause = function () {
      timer.paused = false;
			return timer;
    };

    timer.toggle = function () {
      if (timer.paused) {
        return timer.unpause();
      }
      else {
        return timer.pause();
      }
    };

    timer.restart = function () {
      timer.reset(original);
			return timer;
    }

    return timer;
  }

  intersects(obj, otherObj, ratio) {
    if (!obj || !otherObj) {
      return false;
    }
    if (!ratio) {
      ratio = 1;
    }
    if (ratio < 0.001 || !obj.active || !otherObj.active) {
      return false;
    }

    let a = obj.getBounds();
    let b = otherObj.getBounds();
    if (ratio != 1) {

      a.width *= ratio;
      a.height *= ratio;
      a.centerX = obj.x;
      a.centerY = obj.y;

      b.width *= ratio;
      b.height *= ratio;
      b.centerX = otherObj.x;
      b.centerY = otherObj.y;
    }
    return Phaser.Geom.Intersects.RectangleToRectangle(a, b);
  }

  getPointer() {
    let obj = this.input.activePointer;

    obj.isDown = function () {
      return obj.isDown;
    }
    obj.getX = function () {
      return obj.worldX;
    }
    obj.getY = function () {
      return obj.worldY;
    }
    return obj
  }
}