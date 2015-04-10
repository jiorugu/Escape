var PauseScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.pauseLayer = new PauseLayer();
		this.addChild(this.pauseLayer);
	}
});