var LevelLayer = cc.Layer.extend({
	ctor : function(mapFile) {
		//TODO: rename all player variables to activesprite
		this._super();

		this.mapLayer = new MapLayer(mapFile);
		this.hudLayer = new HUDLayer(this);
		this.pauseLayer = new PauseLayer(this);
		this.dimLayer = new cc.LayerColor(cc.color(0,0,0,100));
		this.dimLayer.setOpacity(0);
		this.levelFinishedLayer = new LevelFinishedLayer();
		this.addChild(this.mapLayer, 0);
		this.addChild(this.hudLayer, 10);
		this.addChild(this.pauseLayer, 20);
		this.addChild(this.dimLayer);
		this.addChild(this.levelFinishedLayer);
	
		
		//general player movement(walking + eventactions)
		this.isMoving = false;
		//if true -> player moves until event or collision(arrow tiles)
		this.keepMoving = false;

		//player walking
		this.isWalking = false;
		this.curDestination;
		this.curDirection;
		//move 1 pixel per update
		this.speed = 1;

		//sprite to move (switching between player and boulder)
		this.activeSprite = this.mapLayer.player;

		//if yes -> check for wind direction updates
		this.isWindMap = false;
		this.checkForSpecialControlls();
		
		this.scheduleUpdate();
	},
	
	checkForSpecialControlls : function() {
		if(this.mapLayer.isWindMap()) {
			this.isWindMap = true;
			this.curWindDirection = "right";
			this.hudLayer.controlLayer.initWindButton();
		}
	},

	update : function(dt) {
		if(this.isWalking) {
			this.walkPlayerToDestination();
		}
		else if(this.isMoving == false){
			this.checkForNewDestination(this.checkIfDirectionChanged());
		}
		
		if(this.isWindMap) {
			var newDirection = this.hudLayer.controlLayer.curWindDirection;
			if(newDirection != this.curWindDirection) {
				this.mapLayer.rotateWind();
				this.curWindDirection = newDirection;
				
				//Move player if currently standing on gust and direction changed
				var playerPos = this.mapLayer.player.getPosition();
				if(this.mapLayer.tileMap.getEventOnPos(playerPos) == "gust"){
					this.runGustEvent();
				}
			}
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
			if(this.mapLayer.tileMap.isCollidable(newPos) || this.specialBoulderCollision(newPos)) {
				this.stopSprite();
			} else if(this.mapLayer.collidesWithBoulder(newPos)) {
				if(this.activeSprite == this.mapLayer.player) {
					this.pushBoulder(newPos);
				} else {
					this.stopSprite();
				}
			} else{ //No Collision
				//Start new Sprite Movement
				this.curDestination = newPos;
				this.isWalking = true;
				this.isMoving = false;

				//Check if moving sprite walks away from a crumbly tile and trigger event
				var currentPos = this.activeSprite.getPosition();
				
				if(this.mapLayer.tileMap.checkIfLeavingCrumblyTile(currentPos)){
					this.mapLayer.startCrumblyAnimation(currentPos);
				} 
				
				if(this.mapLayer.tileMap.checkIfLeavingIceTile(currentPos)) {
					this.speed = 2;
					if(!directionChanged) {
						this.mapLayer.player.stopAllActions();
					}
				} else {
					//walk on normal speed if not leaving ice tile
					this.speed = 1;
				}
			}
		}
	},

	walkPlayerToDestination : function() {
		var dest = this.curDestination;
		var tileMap = this.mapLayer.tileMap;
		var playerPos = this.activeSprite.getPosition();

		//X COORD
		if (dest.x < playerPos.x) {
			playerPos.x -= this.speed; 
		} else if (dest.x > playerPos.x) {
			playerPos.x += this.speed;
		} //Y COORD
		else if (dest.y < playerPos.y) {
			playerPos.y -= this.speed; 
		} else if (dest.y > playerPos.y) {
			playerPos.y += this.speed;
		}

		this.activeSprite.setPosition(playerPos);
		this.mapLayer.setViewPointCenter(cc.pMult(this.mapLayer.player.getPosition(), this.mapLayer.getScale()));

		//check if palyer reached it's destination(next tile)
		if(this.checkIfPointsAreEqual(playerPos, dest)) { 
			this.endMoving();
		}		
	},

	endMoving : function() {
		//Get Event on current Tile
		var event = this.mapLayer.tileMap.getEventOnPos(this.curDestination);

		if(event == "noevent") {
			if(this.keepMoving) {
				this.checkForNewDestination(false);
			} else {
				//Player is neither walking or running an action
				//If currently touched direction input equals sprites direction -> player keeps moving and don't stop animation.
				//Automatically stop animation if sprite isn't player.
				if(this.hudLayer.controlLayer.curDirection != this.curDirection || this.activeSprite != this.mapLayer.player) {
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
			this.runEvent(event);
		}
	},

	specialBoulderCollision : function(pos) {
		if(this.activeSprite != this.mapLayer.player) {
			//Colliding with player
			var playerPos = this.mapLayer.player.getPosition();
			if(playerPos.x == pos.x && playerPos.y == pos.y) {
				return true;
			}
		}
		return false;
	},

	//Stop Sprite Movement
	stopSpriteWalking : function() {
		this.isWalking = false;
		this.isMoving = true;
		this.keepMoving = false;
	},

	//Stop Sprite Animation and Movement
	stopSprite : function() {
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

		//keepMoving true would make the boulder move on after pushing it while being on the arrow event
		this.keepMoving = false;

		//direction changed set to true to start boulder animation
		this.checkForNewDestination(true);
	},

	//Special Tile Event Handling
	runEvent : function(event) {
		switch(event) {
		case "trampoline":
			this.stopSpriteWalking();
			this.runTrampolineEvent();
			break;
		case "ice":
			//this.stopSpriteWalking();
			this.runIceEvent();
			break;
		case "arrow":
			this.stopSpriteWalking();
			this.runArrowEvent();
			break;
		case "gust":
			this.stopSpriteWalking();
			this.runGustEvent();
			break;
		case "crumbly":
			if(this.keepMoving) {
				this.checkForNewDestination(false);
			}
			else {
				this.stopSprite();
			}
			break;
		case "switch":
			this.runSwitchEvent();
			break;
		case "portal":
			this.stopSpriteWalking();
			this.runPortalEvent();
			break;
		case "exit":
			this.stopSpriteWalking();
			this.runExitEvent();
			break;
		default : this.isWalking = false; this.isMoving = false; this.activeSprite.setFrameIdle(this.curDirection);
		}
	},

	runTrampolineEvent : function() {
		if(this.activeSprite == this.mapLayer.player) {
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
		} else {
			this.stopSprite();
		}
	},

	runIceEvent : function() {
		//move player
		this.checkForNewDestination(false);
	},

	runArrowEvent : function() {
		this.keepMoving = true;

		//get direction
		this.curDirection = this.mapLayer.tileMap.getArrowDirectionOnPos(this.curDestination); 

		//move player
		this.checkForNewDestination(true);
	},
	
	runGustEvent : function() {
		this.curDirection = this.curWindDirection;
		//move player
		this.checkForNewDestination(true);
	},
	
	runSwitchEvent : function() {
		this.mapLayer.switchDoors(this.curDestination);
		
		if(this.keepMoving) {
			this.checkForNewDestination(false);
		}
		else {
			this.stopSprite();
		}
	},

	runPortalEvent : function() {
		var portalTag = this.mapLayer.getPortalTagOnPosition(this.curDestination);
		var newPos = this.mapLayer.getPortalPositionWithTag(portalTag, this.curDestination);

		//check if new position is occupied
		if(!this.mapLayer.collidesWithBoulder(newPos)) {
			var eventDirection = this.curDirection;

			var fadeOutAction = cc.fadeOut(0.2);	
			var callMoveMapFunc = cc.CallFunc.create(this.moveMapPortalSequence, this, {"newPos": newPos, "oldPos":this.curDestination, "direction":eventDirection});
			var sequence = cc.Sequence(fadeOutAction, callMoveMapFunc);

			this.mapLayer.setViewPointCenter(cc.pMult(this.activeSprite.getPosition(), this.mapLayer.getScale()));
			this.activeSprite.runAction(sequence);
		}
		else {
			this.stopSprite();
		}
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
		var fadeInAction = cc.fadeIn(0.2);
		var checkForNewDestinationFunc = cc.CallFunc.create(this.checkForNewDestination, this, false);
		var sequence = cc.Sequence(fadeInAction, checkForNewDestinationFunc);

		//set the direction in which the player entered
		this.curDirection = data;
		this.activeSprite.runAction(sequence);
	},

	runExitEvent : function() {
		if(this.activeSprite == this.mapLayer.player) {
			this.stopSprite();
			this.pause();
			this.mapLayer.pause();
			this.hudLayer.controlLayer.children.forEach(function(child) {
				child.setTouchEnabled(false);
			});
			
			this.dimLayer.setOpacity(100);
			this.levelFinishedLayer.showMenu();
			
		} else {
			this.stopSprite();
		}
	},
	
	pauseGame : function() {
		this.pause();
		this.mapLayer.pause();
		this.hudLayer.controlLayer.children.forEach(function(child) {
			child.setTouchEnabled(false);
		});
		
		this.dimLayer.setOpacity(100);
		this.pauseLayer.showMenu();
	},
	
	resumeGame : function() {
		this.pauseLayer.hideMenu();
		this.resume();
		this.mapLayer.resume();
		this.hudLayer.controlLayer.children.forEach(function(child) {
			child.setTouchEnabled(true);
		});
		this.dimLayer.setOpacity(0);
	}
});