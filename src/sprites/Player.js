var Player = cc.Sprite.extend({
	ctor : function() {
		this._super();
		this.initWithFile("#player_down0.png");
		this.setAnchorPoint(0, 0);
		this.animationDown = this.initAnimation("down");
		this.runAction(this.animationDown);
	},
	
	initAnimation : function(direction) {
		cc.spriteFrameCache.addSpriteFrames(res.player_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "player_" + direction + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, 3, Math.round(animationTime / 3));
		return new cc.Animate(animation);
	}
});