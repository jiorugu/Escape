var Trapdoor = cc.Sprite.extend({
		ctor : function(pos, state, color) {
			this._super();
			this.state = state;
			
			if(state == DoorState.OPEN) {
				this.initWithFile("#trapdoor_3");
				cc.spriteFrameCache.addSpriteFrames(res.trapdoor_plist);
				this.setSpriteFrame("trapdoor_3");
			} else if(state == DoorState.CLOSED) {
				this.initWithFile("#trapdoor_0");
				cc.spriteFrameCache.addSpriteFrames(res.trapdoor_plist);
				this.setSpriteFrame("trapdoor_0");
			}
			
			this.setColor(cc.color(color));
			this.setAnchorPoint(0, 0);
			this.getTexture().setAliasTexParameters();
			this.setPosition(pos.x, pos.y);
		},
		
		runAnimation : function() {
			if(this.state == DoorState.OPEN) {
				this.runAnimationClose();
			} else if(this.state == DoorState.CLOSED) {
				this.runAnimationOpen();
			}
		},
		
		runAnimationOpen : function() {
			cc.spriteFrameCache.addSpriteFrames(res.trapdoor_plist);
			var animFrames = [];
			for (var i = 0; i < 4; i++) {
				var str = "trapdoor_" + i;
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animFrames.push(frame);
			}

			var animation = new cc.Animation(animFrames, 0.2);
			this.runAction(cc.Animate(animation));
			this.state = DoorState.OPEN;
		},
		
		runAnimationClose : function() {
			cc.spriteFrameCache.addSpriteFrames(res.portal_plist);
			var animFrames = [];
			for (var i = 3; i >= 0; i--) {
				var str = "trapdoor_" + i;
				var frame = cc.spriteFrameCache.getSpriteFrame(str);
				animFrames.push(frame);
			}

			var animation = new cc.Animation(animFrames, 0.2);
			this.runAction(cc.Animate(animation));
			this.state = DoorState.CLOSED;
		}
});