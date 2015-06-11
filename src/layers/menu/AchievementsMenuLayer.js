var AchievementsMenuLayer = cc.Layer.extend({
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

		var achievement1 = new cc.MenuItemFont("Away from Keyboard \n - 15 Minuten überhaupt nichts getan");
		achievement1.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+150));
		achievement1.setFontSize(30);
		
		var achievement2 = new cc.MenuItemFont("No Game no Life \n - 10 Stunden durchgehend gespielt");
		achievement2.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+75));
		achievement2.setFontSize(30);
		
		var achievement3 = new cc.MenuItemFont("Furioser Stuhlgang \n - 50 Levels nacheinander geschafft");
		achievement3.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-0));
		achievement3.setFontSize(30);

		
		//back to main menu
		var menuItemReturn = new cc.MenuItemFont("Return", this.returnToMainMenu);
		menuItemReturn.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-100));

		//Applying Items to menu to scene
		var menu = new cc.Menu(achievement1,achievement2,achievement3,menuItemReturn);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	},

	returnToMainMenu : function() {
		cc.director.replaceScene(new MainMenuScene());
	}
});