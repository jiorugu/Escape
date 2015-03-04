var MapLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		
		this.setScale(2);
		this.initTileMap();
		this.initObjects();

		this.scheduleUpdate();
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

	update : function(dt) {

	},

	initTileMap : function() {	
		this.tileMap = new TileMap(res.map1);
		this.addChild(this.tileMap, -1);

		this.initLayers();
		
		var objectGroup = this.tileMap.getObjectGroup("objects");
		var spawnPos = objectGroup.getObject("spawn");
		var centeredPos = this.tileMap.centerPosition(spawnPos);
			
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
				//Start Portal Animation
				this.startPortalAnimation(position);
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
		portalSprite.setSpriteFrame("portal0");
		portalSprite.setPosition(position);
		this.tileMap.addChild(portalSprite, 1);
		portalSprite.runAction(repeatAnimation);
	},
	
	initControlLayer : function() {
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer, 5);
	},
	
	setViewPointCenter : function(pos) {
		var winSize = cc.director.getWinSize();
	
		var centerOfView = cc.p((winSize.width * this.getScale()) / 2, (winSize.height * this.getScale()) / 2);
		var viewPoint = cc.pSub(centerOfView, pos);
		this.setPosition(viewPoint);
	}
});