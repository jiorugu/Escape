var ControlLayer = cc.Layer.extend({
	ctor : function(levelLayer) {
		this._super();
		this.levelLayer = levelLayer;
		var size = cc.director.getWinSize();
		this.initPauseButton();
		this.initKeyboardControl();
		this.initDPad();
		this.curDirection = "idle";
		this.curWindDirection = "right";
	},
	
	buttonPressed : function(direction, type) {
		//TOUCH ENDED
		if(type == 2) {
			direction = "idle";
		}
		this.curDirection = direction;
	},
	
	initPauseButton  : function() {
		//TODO: change to relative position
		var pauseButtonPos = cc.p(cc.winSize.width - 50, cc.winSize.height - 50);

		var pauseButton = ccui.Button();
		pauseButton.setTouchEnabled(true);
		pauseButton.setPressedActionEnabled(true);
		pauseButton.loadTextures(res.pauseButton, res.arrowPressed, "");
		pauseButton.setAnchorPoint(0, 0);
		pauseButton.setPosition(pauseButtonPos);
		pauseButton.addTouchEventListener(this.openPauseMenu, this);
		this.addChild(pauseButton);
	},
	
	initKeyboardControl : function() {
		if(cc.sys.capabilities.hasOwnProperty('keyboard')) {
			var that = this;
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
	
				onKeyPressed : function(key, type) {
					if(key == 40) {
						that.buttonPressed("down");
					} else if(key == 39) {
						that.buttonPressed("right");
					} else if(key == 38) {
						that.buttonPressed("up");
					} else if(key == 37) {
						that.buttonPressed("left");
					}
				},
				
				onKeyReleased : function(key, type) {
					if(that.curDirection == "down" && key == 40 ||
						that.curDirection == "right" && key == 39 ||
						that.curDirection == "up" && key == 38 ||
						that.curDirection == "left" && key == 37) {
						that.buttonPressed("idle");
					}
				}
			}, this);
		}
	},

	initDPad : function() {	
		var that = this;
		//TODO: change to relative positions
		
		//BUTTON UP
		var upButton = ccui.Button();
		upButton.setTouchEnabled(true);
		upButton.setPressedActionEnabled(true);
		upButton.loadTextures(res.arrowUp, res.arrowPressed, "");
		upButton.setPosition(100, 150);
		upButton.addTouchEventListener(function (sender, type) {	
			that.buttonPressed("up", type);
		}, this);
		this.addChild(upButton);
		
		//BUTTON DOWN
		var downButton = ccui.Button();
		downButton.setTouchEnabled(true);
		downButton.loadTextures(res.arrowDown, res.arrowPressed, "");
		downButton.setPosition(100, 50);
		downButton.addTouchEventListener(function (sender, type) {
			that.buttonPressed("down", type);
		}, this);
		this.addChild(downButton);
		
		//BUTTON LEFT
		var leftButton = ccui.Button();
		leftButton.setTouchEnabled(true);
		leftButton.loadTextures(res.arrowLeft, res.arrowPressed, "");
		leftButton.setPosition(50, 100);
		leftButton.addTouchEventListener(function (sender, type) {
			that.buttonPressed("left", type);
		}, this);
		this.addChild(leftButton);
		
		//BUTTON RIGHT
		var rightButton = ccui.Button();
		rightButton.setTouchEnabled(true);
		rightButton.loadTextures(res.arrowRight, res.arrowPressed, "");
		rightButton.setPosition(150, 100);
		rightButton.addTouchEventListener(function (sender, type) {
			that.buttonPressed("right", type);
		}, this);
		this.addChild(rightButton);
	},
	
	initWindButton : function() {
		var windButton = ccui.Button();
		windButton.setTouchEnabled(true);
		windButton.setPressedActionEnabled(true);
		windButton.loadTextureNormal(res.arrowRight, "");
		//windButton.setAnchorPoint(0, 0);
		windButton.setPosition(cc.winSize.width - 50, cc.winSize.height-100);
		var that = this;
		windButton.addTouchEventListener(function(sender, type){
			//activate only on touch began
			if(type == 0) {
				if(sender.getNumberOfRunningActions() == 0) {
					sender.runAction(new cc.RotateBy(0.2,90));
					
					//Set new direction
					if(that.curWindDirection == "right") {
						that.curWindDirection = "down";
					} else if(that.curWindDirection == "down") {
						that.curWindDirection = "left";
					} else if(that.curWindDirection == "left") {
						that.curWindDirection = "up";
					} else if(that.curWindDirection == "up") {
						that.curWindDirection = "right";
					}
				}
			}
		}, this);
		this.addChild(windButton);
	},
	
	openPauseMenu : function(sender, type) {
		//activate only on touch began
		if(type == 0) {
			this.levelLayer.pauseGame();
		}
	}
});