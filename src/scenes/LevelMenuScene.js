var LevelMenuScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.levelMenuLayer = new LevelMenuLayer();
		this.addChild(this.levelMenuLayer);
	}
});