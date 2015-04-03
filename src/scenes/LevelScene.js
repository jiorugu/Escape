var LevelScene = cc.Scene.extend({
	ctor: function(mapFile) {
		this._super();
		this.levelLayer = new LevelLayer(mapFile);
		this.addChild(this.levelLayer);
	}
});