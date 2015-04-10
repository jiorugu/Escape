var PauseLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.initMenu();

		return true;
	},

	initMenu : function() {
		//TODO: Change to relative positions
		cc.MenuItemFont.setFontSize(60);

		var menuItemReturnToGame = new cc.MenuItemFont("Resume", returnToGame, this);
		var menuItemReturnToLevelSelect = new cc.MenuItemFont("Return To Menu", returnToMenu, this);

		menuItemReturnToGame.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));
		menuItemReturnToLevelSelect.setPosition(new cc.p(cc.winSize.width/2, cc.winSize.height/2));

		//Applying Items to menu to scene
		var menu = new cc.Menu(menuItemReturnToGame, menuItemReturnToLevelSelect);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	}
});

var returnToGame = function() {
	cc.director.popScene();
}

var returnToMenu = function() {
	cc.director.replaceScene(new LevelMenuScene());
}