var LevelMenuLayer = cc.Layer.extend({
	ctor : function() {
		this._super();

		var centerPos = cc.p(cc.winSize.width / 2, cc.winSize.height / 2);

		//Background Image
		var bgImage = new cc.Sprite(res.Background_png);
		bgImage.setPosition(centerPos);
		this.addChild(bgImage);
		
		this.initMenu();
	
		return true;
	},
	
	initMenu : function() {
		//TODO: Change to relative positions, generate menuItems dynamically
		cc.MenuItemFont.setFontSize(60);

		var menuItemMap1 = new cc.MenuItemFont("Test All Map", switchToLevel, this);
		var menuItemMap2 = new cc.MenuItemFont("Ice Test 1", switchToLevel, this);
		var menuItemMap3 = new cc.MenuItemFont("Ice Test 2", switchToLevel, this);
		var menuItemReturn = new cc.MenuItemFont("Return", returnToMainMenu, this);


		menuItemMap1.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));
		menuItemMap2.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2));
		menuItemMap3.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-50));
		menuItemReturn.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-100));

		//Link Map Filename with MenuItem
		menuItemMap1.setUserData(res.map1);
		menuItemMap2.setUserData(res.map2);
		menuItemMap3.setUserData(res.map3);

		//Applying Items to menu to scene
		var menu = new cc.Menu(menuItemMap1, menuItemMap2, menuItemMap3, menuItemReturn);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	}
});

var switchToLevel = function(sender){
	var mapFile = sender.userData;
	cc.director.replaceScene(new LevelScene(mapFile));
}

var returnToMainMenu = function() {
	cc.director.replaceScene(new MainMenuScene());
}
