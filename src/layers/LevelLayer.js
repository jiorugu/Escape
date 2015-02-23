var LevelLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.mapLayer = new MapLayer();
		this.hudLayer = new HUDLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);
		
		this.isMoving = false;
		this.occupied = false;
		this.scheduleUpdate();
	},

	update : function(dt) {
		if(!this.isMoving && !this.occupied) {
			this.occupied = true;
			//Get current direction from DPAD 
			var currDirection = this.hudLayer.controlLayer.currDirection;
			
			//Get X and Y coordinates
			var directionPoint = new cc.p(0,0);
		
			if(currDirection != "idle") {
				this.hudLayer.controlLayer.currDirection = "idle";
				
				if(currDirection == "up") {
					directionPoint = cc.p(0,1);
				} else if(currDirection == "down") {
					directionPoint = cc.p(0,-1);
				} else if(currDirection == "left") {
					directionPoint = cc.p(-1,0);
				} else if(currDirection == "right") {
					directionPoint = cc.p(1,0);
				}
				var playerSize = this.mapLayer.player.getContentSize();
				var moveByAction = cc.MoveBy(animationTime, directionPoint.x * playerSize.width, directionPoint.y * playerSize.height);
				//var jumpByAction = cc.JumpBy(0.5, cc.p(directionPoint.x * playerSize.width * 2, directionPoint.y * playerSize.height * 2), 15, 1);
				
				
				var animation = this.mapLayer.player.initAnimation(currDirection);
				var spawnAction = new cc.Spawn(animation, moveByAction);
				
				var that = this; 
				var sequenceAction = cc.Sequence(
						cc.callFunc((function() {that.isMoving = true;}), this),
						spawnAction,
						cc.callFunc(function(){that.mapLayer.setViewPointCenter(that.mapLayer.player.getPosition());that.isMoving = false; that.occupied = false;}), this);
				this.mapLayer.player.stopAllActions();
				this.mapLayer.player.runAction(sequenceAction);	
			} else {
				this.occupied = false; 
			}
		}
	}
});