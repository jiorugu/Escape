var HUDLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer);
		
		this.initPauseMenu();
	},
	
	initPauseMenu : function() {
		//TODO: change to relative position
		var pauseButtonPos = cc.p(cc.winSize.width - 50, cc.winSize.height - 50);
		
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
	//TODO: Add layer instead of replace + use transparency
	
	//activate only on touch began
	if(type == 0) {
		cc.director.pushScene(new PauseScene());
	}
}