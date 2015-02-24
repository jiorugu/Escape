var LevelLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.mapLayer = new MapLayer();
		this.hudLayer = new HUDLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);
		
		this.isMoving = false;
		this.curDestination;
		this.curDirection;
		
		this.scheduleUpdate();
	},

	update : function(dt) {
		if(this.isMoving) {
			this.movePlayerToDestination();
		}
		else{
			this.checkForNewDestination();
		}
	},
	
	checkForNewDestination : function() {
		var directionChanged = true;
		
		//Get current direction from DPAD 
		if(this.hudLayer.controlLayer.currDirection == this.curDirection) {
			directionChanged = false;
		} else {
			this.curDirection = this.hudLayer.controlLayer.currDirection;
		}

		if(this.curDirection != "idle") {
			//Get X and Y coordinates
			var directionPoint = new cc.p(0,0);
			var tileSize = this.mapLayer.tileMap.getTileSize(); 
			
			if(this.curDirection == "up") {
				directionPoint = cc.p(0,tileSize.height);
			} else if(this.curDirection == "down") {
				directionPoint = cc.p(0,-tileSize.height);
			} else if(this.curDirection == "left") {
				directionPoint = cc.p(-tileSize.width, 0);
			} else if(this.curDirection == "right") {
				directionPoint = cc.p(tileSize.width, 0);
			}
			
			var animation = this.mapLayer.player.initAnimation(this.curDirection);
			if(directionChanged) {
				this.mapLayer.player.runAction(animation);
			}
			
			this.curDestination = cc.pAdd(this.mapLayer.player.getPosition(), directionPoint);
			this.isMoving = true;
		}
	},
	
	movePlayerToDestination : function() {		
		var dest = this.curDestination;
		var tileMap = this.mapLayer.tileMap;
		var playerPos = this.mapLayer.player.getPosition();
		
		//X COORD
		if (dest.x < playerPos.x) {
			playerPos.x --; 
		} else if (dest.x > playerPos.x) {
			playerPos.x ++;
		} //Y COORD
		else if (dest.y < playerPos.y) {
			playerPos.y --; 
		} else if (dest.y > playerPos.y) {
			playerPos.y ++;
		}
		
		this.mapLayer.player.setPosition(playerPos);
		this.mapLayer.setViewPointCenter(cc.pMult(this.mapLayer.player.getPosition(), this.mapLayer.getScale()));

		if(this.checkIfPointsAreEqual(playerPos, dest)) { 
			if(this.hudLayer.controlLayer.currDirection != this.curDirection) {
				this.mapLayer.player.setFrameIdle(this.curDirection);
			} 
			this.isMoving = false;
		}		
	},
	
	checkIfPointsAreEqual: function (point1, point2) {
		if(point1.x == point2.x && point1.y == point2.y)
			return true;
		else
			return false;
	}
});