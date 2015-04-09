var LevelLayer = cc.Layer.extend({
	ctor : function(mapFile) {
		//TODO: rename all player variables to activesprite
		this._super();
		this.mapLayer = new MapLayer(mapFile);
		this.hudLayer = new HUDLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);

		//general player movement(walking + eventactions)
		this.isMoving = false;
		//if true -> player moves until event or collision(arrow tiles)
		this.keepMoving = false;

		//player walking
		this.isWalking = false;
		this.curDestination;
		this.curDirection;
		
		//sprite to move (switching between player and boulder)
		this.activeSprite = this.mapLayer.player;

		this.scheduleUpdate();
	},

	update : function(dt) {
		if(this.isWalking) {
			this.walkPlayerToDestination();
		}
		else if(this.isMoving == false){
			this.checkForNewDestination(this.checkIfDirectionChanged());
		}
	},

	checkIfDirectionChanged : function() {
		var directionChanged;
		if(this.hudLayer.controlLayer.curDirection == this.curDirection) {
			directionChanged = false;
		} else {
			directionChanged = true;
			this.curDirection = this.hudLayer.controlLayer.curDirection;
		}

		return directionChanged;
	},

	//check if direction changed to start new animation
	checkForNewDestination : function(didDirectionChange) {
		var directionChanged = didDirectionChange;
		
		if(this.curDirection != "idle") {
			//Get X and Y coordinates
			var directionPoint = this.getNextTileForCurrentDirection();

			var animation = this.activeSprite.initAnimation(this.curDirection);
			if(directionChanged) {
				this.activeSprite.stopAllActions();
				this.activeSprite.runAction(animation);
			}

			var newPos = cc.pAdd(this.activeSprite.getPosition(), directionPoint);
		
			//Collision Detection
			var tileCoord = this.mapLayer.tileMap.getTileCoordForPos(newPos);
			
			if(this.mapLayer.tileMap.isCollidable(tileCoord) || this.isCollidingWithPlayer(newPos)) {
				this.spriteCollided();
			} else if(this.mapLayer.collidesWithBoulder(newPos)) {
				if(this.activeSprite == this.mapLayer.player) {
					this.pushBoulder(newPos);
				} else {
					this.spriteCollided();
				}
			} else{
				this.curDestination = newPos;
				this.isWalking = true;
				this.isMoving = false;
			}
		}
	},
	
	walkPlayerToDestination : function() {
		var dest = this.curDestination;
		var tileMap = this.mapLayer.tileMap;
		var playerPos = this.activeSprite.getPosition();

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

		this.activeSprite.setPosition(playerPos);
		
		this.mapLayer.setViewPointCenter(cc.pMult(this.mapLayer.player.getPosition(), this.mapLayer.getScale()));

		//check if palyer reached it's destination(next tile)
		if(this.checkIfPointsAreEqual(playerPos, dest)) { 
			this.endMoving();
		}		
	},

	endMoving : function() {
		var gid = this.mapLayer.tileMap.getTileCoordForPos(this.curDestination);
		var event = this.mapLayer.tileMap.getEventOnGid(gid);

		if(event == "noevent") {
			if(this.keepMoving) {
				this.checkForNewDestination(false);
			} else {
				//Player is neither walking or running an action
				if(this.hudLayer.controlLayer.curDirection != this.curDirection) {
					this.activeSprite.setFrameIdle(this.curDirection);
				} 
				//reset active sprite to player;
				this.activeSprite = this.mapLayer.player;
				this.isWalking = false;
				this.isMoving = false;
			}
		}
		else {
			//Player ended walking and starts action
			this.isWalking = false;
			this.isMoving = true;
			this.keepMoving = false;
			this.runEvent(event);
		}
	},
	
	isCollidingWithPlayer : function(pos) {
		if(this.activeSprite != this.mapLayer.player) {
			var playerPos = this.mapLayer.player.getPosition();
			if(playerPos.x == pos.x && playerPos.y == pos.y) {
				return true;
			}
		}
		return false;
	},
	
	spriteCollided : function() {
		cc.log("collided" + this.activeSprite);
		this.activeSprite.setFrameIdle(this.curDirection);
		//reset active sprite to player
		this.activeSprite = this.mapLayer.player;
		this.isWalking = false;
		this.isMoving = false;
		this.keepMoving = false;
	},

	checkIfPointsAreEqual: function(point1, point2) {
		if(point1.x == point2.x && point1.y == point2.y)
			return true;
		else
			return false;
	},

	getNextTileForCurrentDirection : function() {
		var tileSize = this.mapLayer.tileMap.getTileSize(); 
		var directionPoint;

		if(this.curDirection == "up") {
			directionPoint = cc.p(0,tileSize.height);
		} else if(this.curDirection == "down") {
			directionPoint = cc.p(0,-tileSize.height);
		} else if(this.curDirection == "left") {
			directionPoint = cc.p(-tileSize.width, 0);
		} else if(this.curDirection == "right") {
			directionPoint = cc.p(tileSize.width, 0);
		}

		return directionPoint;
	},
	
	pushBoulder : function(newPos) {
		//player pushed boulder -> change active sprite to boulder to move it
		this.activeSprite.setFrameIdle(this.curDirection);
		this.activeSprite = this.mapLayer.getBoulderAtPos(newPos);
		//set tile behind boulder as destination
		this.curDestination = cc.pAdd(newPos, this.getNextTileForCurrentDirection());
		//direction changed set to true to start boulder animation
		this.checkForNewDestination(true);
	},

	//Special Tile Event Handling
	runEvent : function(event) {
		switch(event) {
		case "trampoline":
			this.runTrampolineEvent();
			break;
		case "ice":
			this.runIceEvent();
			break;
		case "arrow":
			this.runArrowEvent();
			break;
		case "portal":
			this.runPortalEvent();
			break;
		case "exit":
			this.runExitEvent();
			break;
		default : this.isWalking = false; this.isMoving = false; this.activeSprite.setFrameIdle(this.curDirection);
		}
	},

	runTrampolineEvent : function() {
		var playerSize = this.activeSprite.getContentSize();

		if(this.curDirection == "up") {
			directionPoint = cc.p(0,playerSize.height * 2);
		} else if(this.curDirection == "down") {
			directionPoint = cc.p(0,-playerSize.height * 2);
		} else if(this.curDirection == "left") {
			directionPoint = cc.p(-playerSize.width * 2, 0);
		} else if(this.curDirection == "right") {
			directionPoint = cc.p(playerSize.width * 2, 0);
		}
		this.curDestination = cc.pAdd(this.activeSprite.getPosition(), directionPoint);
		var jumpByAction = cc.JumpBy(0.5, directionPoint, 15, 1);
		var scale = this.mapLayer.getScale();
		var moveMapAction = cc.MoveBy(0.5, -directionPoint.x*scale, -directionPoint.y*scale);
		var sequence = cc.Sequence(jumpByAction, new cc.CallFunc(this.endMoving, this));
		this.activeSprite.runAction(sequence);
		this.mapLayer.runAction(moveMapAction);
	},

	runIceEvent : function() {
		//move player
		this.checkForNewDestination(false);
	},

	runArrowEvent : function() {
		this.keepMoving = true;

		//get direction
		var gid = this.mapLayer.tileMap.getTileCoordForPos(this.curDestination);
		this.curDirection = this.mapLayer.tileMap.getArrowDirectionOnGid(gid); 

		//move player
		this.checkForNewDestination(true);
	},

	runPortalEvent : function() {
		var portalTag = this.mapLayer.getPortalTagOnPosition(this.curDestination);
		var newPos = this.mapLayer.getPortalPositionWithTag(portalTag, this.curDestination);
		var eventDirection = this.curDirection;

		var fadeOutAction = cc.fadeOut(0.2);	
		var callMoveMapFunc = cc.CallFunc.create(this.moveMapPortalSequence, this, {"newPos": newPos, "oldPos":this.curDestination, "direction":eventDirection});
		var sequence = cc.Sequence(fadeOutAction, callMoveMapFunc);
		
		this.mapLayer.setViewPointCenter(cc.pMult(this.activeSprite.getPosition(), this.mapLayer.getScale()));
		this.activeSprite.runAction(sequence);
	},
	
	moveMapPortalSequence : function(target, data) {
		var oldPos = cc.pMult(data.oldPos, this.mapLayer.getScale());
		var newPos = cc.pMult(data.newPos, this.mapLayer.getScale());
		//TODO: rename variable
		var difference = cc.pSub(oldPos, newPos);
		
		var moveByAction = cc.moveBy(0.4, difference);
		var callEndPortalSequenceFunc = cc.CallFunc.create(this.endPortalSequence, this, data.direction);
		var sequence = cc.Sequence(moveByAction, callEndPortalSequenceFunc);
		
		//set player movement and current position
		this.curDirection = data.direction;
		var directionPoint = this.getNextTileForCurrentDirection();
		this.curDestination = cc.pAdd(newPos, directionPoint);
		this.activeSprite.setPosition(data.newPos);
		this.mapLayer.runAction(sequence);
	},
	
	endPortalSequence : function(target, data) {
		//TODO: bug -> player stays invisible when instantly moving after action
		var fadeInAction = cc.fadeIn(0.2);
		var checkForNewDestinationFunc = cc.CallFunc(this.checkForNewDestination(false), this);
		var sequence = cc.Sequence(fadeInAction,checkForNewDestinationFunc);
		
		//set the direction in which the player entered
		this.curDirection = data;
		this.activeSprite.runAction(sequence);
	},
	
	runExitEvent : function() {
		if(this.activeSprite == this.mapLayer.player) {
			//DEBUG
			this.spriteCollided();
		} else {
			this.spriteCollided();
		}
	}
});