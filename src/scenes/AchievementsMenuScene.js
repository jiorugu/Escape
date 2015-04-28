var AchievementsMenuScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.achievementsMenuLayer = new AchievementsMenuLayer();
		this.addChild(this.achievementsMenuLayer);
	}
});