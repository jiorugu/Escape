var Gust = cc.Sprite.extend({
	ctor : function(pos) {
		this._super();
		this.initWithFile("#gust_0.png");
		cc.spriteFrameCache.addSpriteFrames(res.gust_plist);
		this.setSpriteFrame("gust_0");
		this.getTexture().setAliasTexParameters();
		
		var size = this.getContentSize();
		//Set sprite to midle of tile without anchorpoint
		this.setPosition(pos.x + size.width / 2, pos.y + size.height / 2);
		this.runAction(this.initAnimation());
	},

	initAnimation : function() {
		cc.spriteFrameCache.addSpriteFrames(res.gust_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "gust_" + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, 0.2);
		return new cc.RepeatForever(new cc.Animate(animation));
	}
});