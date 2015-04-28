var CreditsMenuScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.creditsMenuLayer = new CreditsMenuLayer();
		this.addChild(this.creditsMenuLayer);
	}
});