var MapLayer = cc.Layer.extend({
	ctor : function(mapFile) {
		this._super();
		
		this.portals = [];
		
		//this.setScale(2);
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
	
	initPlayer : function(spawnPos) {
		this.player = new Player();
		this.player.setPosition(spawnPos.x, spawnPos.y);
		this.addChild(this.player, 2);
	},
	
	initObjects : function() {
		var objectGroup = this.tileMap.getObjectGroup("objects");
		var objects = objectGroup.getObjects();
		
		//get Portals
		for (var i = 0; i < objects.length; i++) {
			if(objects[i].name == "portal") {
				var position = cc.p(objects[i].x, objects[i].y);
				cc.log(position.x + " y:"+position.y);
				var centerPosition = this.tileMap.centerPosition(position);
				this.portals.push({"tag":objects[i].tag, "pos":centerPosition});
				//Start Portal Animation
				this.startPortalAnimation(centerPosition);
			}
		}
	},
	
	startPortalAnimation : function(position) {
		cc.spriteFrameCache.addSpriteFrames(res.portal_plist);
		var animFrames = [];
		for (var i = 0; i < 3; i++) {
			var str = "portal" + i;
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}

		var animation = new cc.Animation(animFrames, animationTime);
		var repeatAnimation = cc.RepeatForever(new cc.Animate(animation));
		
		//get Sprite for GID
		var portalSprite = cc.Sprite();
		portalSprite.setAnchorPoint(0, 0);
		portalSprite.setSpriteFrame("portal0");
		portalSprite.setPosition(position);
		this.tileMap.addChild(portalSprite, 1);
		portalSprite.runAction(repeatAnimation);
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
	
	initControlLayer : function() {
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer, 5);
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