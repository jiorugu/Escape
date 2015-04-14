var ControlLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		var size = cc.director.getWinSize();
		this.initDPad();
		this.curDirection = "idle";
		this.curWindDirection = "right";
	},
	
	buttonPressed : function(direction) {
		this.curDirection = direction;
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
			//TOUCH ENDED
			if(type == 2) {
				that.buttonPressed("idle");
			} else {
				that.buttonPressed("up");
			}
		}, this);
		this.addChild(upButton);
		
		//BUTTON DOWN
		var downButton = ccui.Button();
		downButton.setTouchEnabled(true);
		downButton.loadTextures(res.arrowDown, res.arrowPressed, "");
		downButton.setPosition(100, 50);
		downButton.addTouchEventListener(function (sender, type) {
			//TOUCH ENDED
			if(type == 2) {
				that.buttonPressed("idle");
			} else {
				that.buttonPressed("down");
			}
		}, this);
		this.addChild(downButton);
		
		//BUTTON LEFT
		var leftButton = ccui.Button();
		leftButton.setTouchEnabled(true);
		leftButton.loadTextures(res.arrowLeft, res.arrowPressed, "");
		leftButton.setPosition(50, 100);
		leftButton.addTouchEventListener(function (sender, type) {
			//TOUCH ENDED
			if(type == 2) {
				that.buttonPressed("idle");
			} else {
				that.buttonPressed("left");
			}
		}, this);
		this.addChild(leftButton);
		
		//BUTTON RIGHT
		var rightButton = ccui.Button();
		rightButton.setTouchEnabled(true);
		rightButton.loadTextures(res.arrowRight, res.arrowPressed, "");
		rightButton.setPosition(150, 100);
		rightButton.addTouchEventListener(function (sender, type) {
			//TOUCH ENDED
			if(type == 2) {
				that.buttonPressed("idle");
			} else {
				that.buttonPressed("right");
			}
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
	}
});