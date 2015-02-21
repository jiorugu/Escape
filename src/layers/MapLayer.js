var MapLayer = cc.Layer.extend({
	ctor : function() {
		this._super();
		this.initTileMap();
		var size = cc.director.getWinSize();
		//this.setPosition(size.width / 2, size.height / 2);
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

		var objectGroup = this.tileMap.getObjectGroup("objectLayer");
		var spawnPos = objectGroup.getObject("Spawn");
		this.initPlayer(spawnPos);
	},
	
	initPlayer : function(spawnPos) {
		this.player = new Player();
		this.player.setPosition(spawnPos.x, spawnPos.y);
		//this.setPosition(this.player.getPosition().x, this.player.getPosition().y);
		this.addChild(this.player, 2);
	},
	
	initControlLayer : function() {
		this.controlLayer = new ControlLayer();
		this.addChild(this.controlLayer, 5);
	}
});