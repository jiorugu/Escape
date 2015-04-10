var Boulder = cc.Sprite.extend({
	ctor : function(posX, posY) {
		this._super();
		this.initWithFile("#boulder.png");
		this.setAnchorPoint(0, 0);
		cc.spriteFrameCache.addSpriteFrames(res.boulder_plist);
		this.setSpriteFrame("boulder_0");
		this.setPosition(posX, posY);
	},

	initAnimation : function() {
		cc.spriteFrameCache.addSpriteFrames(res.boulder_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "boulder_" + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, 0.2);
		return new cc.RepeatForever(new cc.Animate(animation));
	},

	setFrameIdle : function() {
		this.stopAllActions();
		this.setSpriteFrame("boulder_0");
	}
});