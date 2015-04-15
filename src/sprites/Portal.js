var Portal = cc.Sprite.extend({
	ctor : function(pos) {
		this._super();
		this.initWithFile("#portal_0.png");
		this.setAnchorPoint(0, 0);
		cc.spriteFrameCache.addSpriteFrames(res.portal_plist);
		this.setSpriteFrame("portal_0");
		this.getTexture().setAliasTexParameters();
		this.setPosition(pos.x, pos.y);
		this.runAction(this.initAnimation());
	},

	initAnimation : function() {
		cc.spriteFrameCache.addSpriteFrames(res.portal_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "portal_" + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, 0.2);
		return new cc.RepeatForever(new cc.Animate(animation));
	}
});