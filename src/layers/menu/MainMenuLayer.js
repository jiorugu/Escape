var MainMenuLayer = cc.Layer.extend({
	ctor:function () {
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
		//TODO: Change to relative positions
		//Setting up the Menu
		//Start Game
		cc.MenuItemFont.setFontSize(60);
		var menuItemStart = new cc.MenuItemFont("Start Game", switchToLevelMenu, this);
		menuItemStart.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2+50));

		//Special Maps
		var menuItemSpecialMaps = new cc.MenuItemFont("Special Maps", switchToSpecialMaps, this);
		menuItemSpecialMaps.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2));

		//Achievements
		var menuItemAchievements = new cc.MenuItemFont("Achievements", switchToAchievements, this);
		menuItemAchievements.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-50));

		//Credits
		var menuItemCredits = new cc.MenuItemFont("Credits", switchToCredits, this);
		menuItemCredits.setPosition(new cc.p(cc.winSize.width/2,cc.winSize.height/2-100));

		//Applying Items to menu to scene
		var menu = new cc.Menu(menuItemStart, menuItemSpecialMaps, menuItemAchievements, menuItemCredits);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);
	}
});

var switchToLevelMenu = function(){
	cc.director.replaceScene(new LevelMenuScene());
}

var switchToSpecialMaps = function(){
	cc.director.replaceScene(new SpecialMapsMenuScene());
}

var switchToAchievements = function(){
	cc.director.replaceScene(new AchievementsMenuScene());
}

var switchToCredits = function(){
	cc.director.replaceScene(new CreditsMenuScene());
}