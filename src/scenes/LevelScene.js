var LevelScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.levelLayer = new LevelLayer();
		this.addChild(this.levelLayer);
	}
});