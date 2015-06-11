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
		
		//hier werden sachen eingefügt
		var Credits1 = new cc.MenuItemFont("Fejes György - Projektmanagement, Co-Programierung");
		var Credits2 = new cc.MenuItemFont("Nitsch Reinhard - Lead Programierung, Design");
		var Credits3 = new cc.MenuItemFont("Odo Luo - Co-Programierung, Dokumentation");
		var Credits4 = new cc.MenuItemFont("Alexius Rait - Assets");
		
		var menuItemReturn = new cc.MenuItemFont("Return", this.returnToMainMenu);
		
		//Credits1.setString("Fejes - Projektmanagment");
		Credits1.setFontSize(30);
		Credits2.setFontSize(30);
		Credits3.setFontSize(30);
		Credits4.setFontSize(30);
		
		//position
		Credits1.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+100));
		Credits2.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));
		Credits3.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2));
		Credits4.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-50));
		menuItemReturn.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-125));
		
		
		//Applying Items to menu to scene
		var menu = new cc.Menu(Credits1,Credits2,Credits3,Credits4, menuItemReturn);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	},

	returnToMainMenu : function() {
		cc.director.replaceScene(new MainMenuScene());
	}
});