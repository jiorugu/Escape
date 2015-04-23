var HUDLayer = cc.Layer.extend({
	ctor : function(levelLayer) {
		this._super();
		this.controlLayer = new ControlLayer(levelLayer);
		this.addChild(this.controlLayer);
	}
});