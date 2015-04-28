var SpecialMapsMenuScene = cc.Scene.extend({
	ctor: function() {
		this._super();
		this.specialMapsMenuLayer = new SpecialMapsMenuLayer();
		this.addChild(this.specialMapsMenuLayer);
	}
});