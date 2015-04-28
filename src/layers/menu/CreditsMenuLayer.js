var CreditsMenuLayer = cc.Layer.extend({
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

		var menuItemReturn = new cc.MenuItemFont("Return", this.returnToMainMenu);
		menuItemReturn.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-100));

		//Applying Items to menu to scene
		var menu = new cc.Menu(menuItemReturn);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	},

	returnToMainMenu : function() {
		cc.director.replaceScene(new MainMenuScene());
	}
});