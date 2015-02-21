var HUDLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer);
	}
});