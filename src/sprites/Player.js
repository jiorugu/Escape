var Player = cc.Sprite.extend({
	ctor : function() {
		this._super();
		this.initWithFile("#player_down0.png");
		this.setAnchorPoint(0, 0);
		cc.spriteFrameCache.addSpriteFrames(res.player_plist);
		this.setSpriteFrame("player_down0");
	},
	
	initAnimation : function(direction) {
		cc.spriteFrameCache.addSpriteFrames(res.player_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "player_" + direction + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, animationTime);
		return new cc.RepeatForever(new cc.Animate(animation));
	},
	
	setFrameIdle : function(direction) {
		this.stopAllActions();
		this.setSpriteFrame("player_"+direction+"0");
	}
});