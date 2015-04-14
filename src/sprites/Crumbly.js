var Crumbly = cc.Sprite.extend({
	ctor : function(posX, posY) {
		this._super();
		this.initWithFile("#crumbly_0.png");
		this.setAnchorPoint(0, 0);
		cc.spriteFrameCache.addSpriteFrames(res.crumbly_plist);
		this.setSpriteFrame("crumbly_0");
		this.getTexture().setAliasTexParameters();
		this.setPosition(posX, posY);
	},

	initAnimation : function() {
		cc.spriteFrameCache.addSpriteFrames(res.crumbly_plist);
		var animFrames = [];
		for (var i = 0; i < 4; i++) {
			var str = "crumbly_" + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, 0.2);
		return new cc.Animate(animation);
	}
});