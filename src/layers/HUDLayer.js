var HUDLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer);
		
		this.initPauseMenu();
	},
	
	initPauseMenu : function() {
		var pauseButtonPos = cc.p(cc.winSize.width, cc.winSize.height);
		
		var pauseButton = ccui.Button();
		cc.log(pauseButton.height);
		pauseButton.setTouchEnabled(true);
		pauseButton.setPressedActionEnabled(true);
		pauseButton.loadTextures(res.pauseButton, res.arrowPressed, "");
		pauseButton.setPosition(pauseButtonPos);
		pauseButton.addTouchEventListener(openPauseMenu, this);
		this.addChild(pauseButton);
	}
});

var openPauseMenu = function(sender, type) {
	//TODO: add pause menu, activate only on touch began
	if(type == 0)
		cc.log("pause: "+type);
}