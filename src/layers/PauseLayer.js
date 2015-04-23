var PauseLayer = cc.Layer.extend({
	ctor : function(levelLayer) {
		this._super();
		this.levelLayer = levelLayer;
		this.initMenu();
		return true;
	},

	initMenu : function() {
		//TODO: Change to relative positions
		cc.MenuItemFont.setFontSize(60);

		var menuItemReturnToGame = new cc.MenuItemFont("Resume", this.returnToGame, this);
		var menuItemReturnToLevelSelect = new cc.MenuItemFont("Return To Menu", returnToMenu, this);
		
		menuItemReturnToGame.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));
		menuItemReturnToLevelSelect.setPosition(new cc.p(cc.winSize.width/2, cc.winSize.height/2));

		//Applying Items to menu to scene
		this.menu = new cc.Menu(menuItemReturnToGame, menuItemReturnToLevelSelect);
		this.menu.setPosition(new cc.p(0,0));
		this.hideMenu();
		this.addChild(this.menu);
	},
	
	showMenu : function() {
		this.menu.setOpacity(255);
		this.menu.setEnabled(true);
	},
	
	hideMenu : function() {
		this.menu.setOpacity(0);
		this.menu.setEnabled(false);
	},
	
	returnToGame : function() {
		this.levelLayer.resumeGame();
	}
});

var returnToMenu = function() {
	cc.director.replaceScene(new LevelMenuScene());
}