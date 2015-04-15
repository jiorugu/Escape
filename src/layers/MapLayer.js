var MapLayer = cc.Layer.extend({
	ctor : function(mapFile) {
		this._super();
		
		this.portals = [];
		this.boulders = [];
		this.windDirection = "right";
		
		this.setScale(2);
		this.initTileMap(mapFile);
		this.initObjects();

		var that = this;
		
		//TOUCH LISTENER
		cc.eventManager.addListener({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: function(touch, event) {
				return true;
			},
			onTouchMoved: function(touch, event) {
				var delta = touch.getDelta();
				
				//Smooth MoveBy Animation
				var moveAnimation = cc.MoveBy(0.3, delta.x, delta.y);
				that.runAction(moveAnimation);

				//Strict SetTo Position
				/*var diff = cc.pAdd(delta, that.getPosition());
				that.setPosition(diff);*/
			}
		},this);
		
		cc.eventManager.addListener({
			event : cc.EventListener.TOUCH_ALL_AT_ONCE,
			onTouchesMoved: function (touches, event) {
				var touch1 = touches[0];
				var touch2 = touches[1];
				
				//Pinch To Zoom
				if(touches.length > 1) {
					var newDistance = cc.pDistance(touch1.getLocation(), touch2.getLocation());
					that.setScale(newDistance * 0.01);
				}
			}
		}, this);
	},

	initTileMap : function(mapFile) {	
		this.tileMap = new TileMap(mapFile);
		this.addChild(this.tileMap, -1);

		this.initLayers();
		
		var objectGroup = this.tileMap.getObjectGroup("objects");
		var spawnPos = objectGroup.getObject("spawn");
		
		var centeredPos = this.tileMap.centerPosition(spawnPos);;
		this.initPlayer(centeredPos);
		this.setViewPointCenter(cc.pMult(this.player.getPosition(), this.getScale()));
	},
	
	initLayers : function() {
		this.layerGround = this.tileMap.getLayer("ground");
		this.layerEvent = this.tileMap.getLayer("events");
		this.layerObjects = this.tileMap.getLayer("objects");
	},
	
	initControlLayer : function() {
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer, 5);
	},
	
	initPlayer : function(spawnPos) {
		this.player = new Player();
		this.player.setPosition(spawnPos.x, spawnPos.y);
		this.addChild(this.player, 2);
	},
	
	initObjects : function() {
		var objectGroup = this.tileMap.getObjectGroup("objects");
		var objects = objectGroup.getObjects();
		
		//init portals and boulders
		for (var i = 0; i < objects.length; i++) {
			if(objects[i].name == "portal") {
				this.initPortal(objects[i]);
			} else if(objects[i].name == "boulder") {
				this.initBoulder(objects[i]);
			} else if(objects[i].name =="gust") {
				this.initGust(objects[i]);
			}
		}
	},
	
	initPortal : function(portal) {
		var position = cc.p(portal.x, portal.y);
		var centerPosition = this.tileMap.centerPosition(position);
		
		var portalSprite = new Portal(centerPosition);
		this.tileMap.addChild(portalSprite, 1);
		this.portals.push({"tag":portal.tag, "pos":centerPosition});
	},
	
	initBoulder : function(boulder) {
		var position = cc.p(boulder.x, boulder.y);
		var centerPosition = this.tileMap.centerPosition(position);
		
		var boulder = new Boulder(centerPosition);
		this.tileMap.addChild(boulder, 2);
		this.boulders.push(boulder);
	},
	
	initGust : function(gust) {	
		var position = cc.p(gust.x, gust.y);
		var centerPosition = this.tileMap.centerPosition(position);
		var tilePos = this.tileMap.getTileCoordForPos(centerPosition);
		var gust = new Gust(centerPosition);
		this.tileMap.addChild(gust, 3);
		this.tileMap.gusts.push({"sprite":gust, "pos":tilePos});
	},
	
	isWindMap : function() {
		var property = this.tileMap.getProperty("wind");
		if(property != null) {
			this.windDirection = property;
			return true;
		}
		return false;
	},
	
	rotateWind : function() {
		for(var i = 0; i < this.tileMap.gusts.length; i++) {
			var sprite = this.tileMap.gusts[i].sprite;
			sprite.runAction(new cc.RotateBy(0.2, 90));
		}
	},
	
	getPortalTagOnPosition : function(position) {
		for(var i = 0; i < this.portals.length; i++) {
			var curPortalPos = this.portals[i];
			if(position.x == this.portals[i].pos.x && position.y == this.portals[i].pos.y) {
				return this.portals[i].tag;
			}
		}
	},
	
	getPortalPositionWithTag : function(tag, position) {
		for(var i = 0; i < this.portals.length; i++) {
			if(this.portals[i].tag == tag) {
				if(position.x != this.portals[i].pos.x || position.y != this.portals[i].pos.y) {	
					return this.portals[i].pos;
				}
			}
		}
	},
	
	collidesWithBoulder : function(pos) {
		for(var i = 0; i < this.boulders.length; i++) {
			var boulderPos = this.boulders[i].getPosition();
			if(pos.x == boulderPos.x && pos.y == boulderPos.y) {
				return true;
			}
		}
		return false;
	},
	
	getBoulderAtPos : function(pos) {
		for(var i = 0; i < this.boulders.length; i++) {
			var boulderPos = this.boulders[i].getPosition();
			if(pos.x == boulderPos.x && pos.y == boulderPos.y) {
				return this.boulders[i];
			}
		}
		return null;
	},

	startCrumblyAnimation : function(pos) {
		var crumblySprite = new Crumbly(pos);
		this.tileMap.addChild(crumblySprite, 0);
		crumblySprite.runAction(crumblySprite.initAnimation());
	},
	
	setViewPointCenter : function(pos) {
		var centerOfView = this.getViewPointCenter();
		var viewPoint = cc.pSub(centerOfView, pos);
		this.setPosition(viewPoint);
	},
	
	getViewPointCenter : function() {
		var winSize = cc.director.getWinSize();
		var centerOfView = cc.p((winSize.width * this.getScale()) / 2, (winSize.height * this.getScale()) / 2);
		return centerOfView;
	}
});