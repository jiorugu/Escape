var LevelLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.mapLayer = new MapLayer();
		this.hudLayer = new HUDLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);
		
		//general player movement(walking + eventactions)
		this.isMoving = false;
		
		//player walking
		this.isWalking = false;
		this.curDestination;
		this.curDirection;
		
		this.scheduleUpdate();
	},

	update : function(dt) {
		if(this.isWalking) {
			this.walkPlayerToDestination();
		}
		else if(this.isMoving == false){
			this.checkForNewDestination();
		}
	},
	
	checkForNewDestination : function() {
		var directionChanged = true;
		
		//Get current direction from DPAD 
		if(this.hudLayer.controlLayer.curDirection == this.curDirection) {
			directionChanged = false;
		} else {
			this.curDirection = this.hudLayer.controlLayer.curDirection;
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
			
			var newPos = cc.pAdd(this.mapLayer.player.getPosition(), directionPoint);
			
			//Collision Detection
			var tileCoord = this.mapLayer.tileMap.getTileCoordForPos(newPos);
			if(this.mapLayer.tileMap.isCollidable(tileCoord)) {
				this.mapLayer.player.setFrameIdle(this.curDirection);
				this.isWalking = false;
			} else {
				this.curDestination = newPos;
				this.isWalking = true;
			}
		}
	},
	
	walkPlayerToDestination : function() {		
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
			this.endMoving(dest);
		}		
	},
	
	endMoving : function(dest) {
		var gid = this.mapLayer.tileMap.getTileCoordForPos(dest);
		var event = this.mapLayer.tileMap.getEventOnGid(gid);
		
		if(event == "noevent") {
			if(this.hudLayer.controlLayer.curDirection != this.curDirection) {
				this.mapLayer.player.setFrameIdle(this.curDirection);
			} 
			//Player is neither walking or running an action
			this.isWalking = false;
			this.isMoving = false;
		}
		else {
			//Player ended walking and starts action
			this.isWalking = false;
			this.isMoving = true;
			this.runEvent(event);
		}
	},
	
	checkIfPointsAreEqual: function(point1, point2) {
		if(point1.x == point2.x && point1.y == point2.y)
			return true;
		else
			return false;
	},
	
	
	runEvent : function(event) {
		switch(event) {
			case "trampoline":
				this.runTrampolineEvent();
				break;
			default : this.isWalking = false; this.isMoving = false; this.mapLayer.player.setFrameIdle(this.curDirection);
		}
	},
	
	runTrampolineEvent : function() {
		var playerSize = this.mapLayer.player.getContentSize();

		if(this.curDirection == "up") {
			directionPoint = cc.p(0,playerSize.height * 2);
		} else if(this.curDirection == "down") {
			directionPoint = cc.p(0,-playerSize.height * 2);
		} else if(this.curDirection == "left") {
			directionPoint = cc.p(-playerSize.width * 2, 0);
		} else if(this.curDirection == "right") {
			directionPoint = cc.p(playerSize.width * 2, 0);
		}
		var destination = cc.pAdd(this.mapLayer.player.getPosition(), directionPoint);
		var jumpByAction = cc.JumpBy(0.5, directionPoint, 15, 1);
		var scale = this.mapLayer.getScale();
		var moveMapAction = cc.MoveBy(0.5, -directionPoint.x*scale, -directionPoint.y*scale);
		var sequence = cc.Sequence(jumpByAction, new cc.CallFunc(this.endMoving, this, destination));
		this.mapLayer.player.runAction(sequence);
		this.mapLayer.runAction(moveMapAction);
	}
	
});