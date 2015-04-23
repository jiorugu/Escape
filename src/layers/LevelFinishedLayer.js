var LevelFinishedLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.initMenu();
		return true;
	},
	
	initMenu : function() {
		cc.MenuItemFont.setFontSize(35);
		
		var label = new cc.LabelTTF("Level Finished", "Arial", 16);
		var menuItemLevelFinished = new cc.MenuItemLabel(label);
		menuItemLevelFinished.setEnabled(false);
		var menuItemReturnToLevelSelect = new cc.MenuItemFont("Return To Menu", returnToMenu, this);
		
		menuItemLevelFinished.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));
		menuItemReturnToLevelSelect.setPosition(new cc.p(cc.winSize.width / 2, cc.winSize.height/2));
		
		this.menu = new cc.Menu(menuItemLevelFinished, menuItemReturnToLevelSelect);
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
	}
});

var returnToMenu = function() {
	cc.director.replaceScene(new LevelMenuScene());
}