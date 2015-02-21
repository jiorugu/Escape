var ControlLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		var size = cc.director.getWinSize();
		this.scheduleUpdate();
		this.initDPad();
		this.currDirection = "idle";
	},
	
	buttonPressed : function(direction) {
		this.currDirection = direction;
	},

	initDPad : function() {	
		var that = this;
		
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
	}
});