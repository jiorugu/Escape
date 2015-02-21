var MainMenuLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		this._super();

		//Get Screen Size
		var size = cc.winSize;
		var centerPos = cc.p(size.width / 2, size.height / 2);

		//Background Image
		var bgImage = new cc.Sprite(res.Background_png);
		bgImage.setPosition(centerPos);
		this.addChild(bgImage);

		//Setting up the Menu
		//Start Game
		cc.MenuItemFont.setFontSize(60);
		var menuItemStart = new cc.MenuItemFont("Start Game", switchToLevelMenu, this);
		menuItemStart.setPosition(new cc.p(size.width/2,size.height/2+50));

		//Special Maps
		var menuItemSpecialMaps = new cc.MenuItemFont("Special Maps", switchToSpecialMaps, this);
		menuItemSpecialMaps.setPosition(new cc.p(size.width/2,size.height/2));

		//Achievements
		var menuItemAchievements = new cc.MenuItemFont("Achievements", switchToAchievements, this);
		menuItemAchievements.setPosition(new cc.p(size.width/2,size.height/2-50));

		//Credits
		var menuItemCredits = new cc.MenuItemFont("Credits", switchToCredits, this);
		menuItemCredits.setPosition(new cc.p(size.width/2,size.height/2-100));

		//Applying Items to menu to scene
		var menu = new cc.Menu(menuItemStart, menuItemSpecialMaps, menuItemAchievements, menuItemCredits);
		menu.setPosition(new cc.p(0,0));

		this.addChild(menu);


		return true;
	}
});

var switchToLevelMenu = function(){
	//TEMP: move directly to map
	cc.director.replaceScene(new LevelScene());
}

var switchToSpecialMaps = function(){
	//cc.director.replaceScene(new SpecialMapsMenuScene());
}

var switchToAchievements = function(){
	//cc.director.replaceScene(new AchievementsMenuScene());
}

var switchToCredits = function(){
	//cc.director.replaceScene(new CreditsMenuScene());
}

