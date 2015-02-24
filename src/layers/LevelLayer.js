var LevelLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.mapLayer = new MapLayer();
		this.hudLayer = new HUDLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);
		
		this.isMoving = false;
		this.curDestination;
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
		//Get current direction from DPAD 
		var curDirection = this.hudLayer.controlLayer.currDirection;

		if(curDirection != "idle") {
			//Get X and Y coordinates
			var directionPoint = new cc.p(0,0);
			var tileSize = this.mapLayer.tileMap.getTileSize(); 
			
			if(curDirection == "up") {
				directionPoint = cc.p(0,tileSize.height);
			} else if(curDirection == "down") {
				directionPoint = cc.p(0,-tileSize.height);
			} else if(curDirection == "left") {
				directionPoint = cc.p(-tileSize.width, 0);
			} else if(curDirection == "right") {
				directionPoint = cc.p(tileSize.width, 0);
			}
			this.curDestination = cc.pAdd(this.mapLayer.player.getPosition(), directionPoint);
			this.isMoving = true;
		}
	},
	
	movePlayerToDestination : function() {
		//TODO Playeranimation
		//var animation = this.mapLayer.player.initAnimation(curDirection);
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