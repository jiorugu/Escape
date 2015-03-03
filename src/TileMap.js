var TileMap = cc.TMXTiledMap.extend({
	ctor: function(mapFile) {
		this._super();
		this.initWithTMXFile(mapFile);
	},

	getTileCoordForPos : function(pos) {
		var x = Math.floor(pos.x / this.getTileSize().width);
		var y = Math.floor(((this.getTileSize().height * 
				this.getMapSize().height) - pos.y) 
				/ this.getTileSize().height);
		//subtract by 1 -> workaround for cocos2d offset problem
		return new cc.p(x, y-1);
	},
	
	isCollidable : function(gid) {
		if (gid) {
			var layer = this.getLayer("ground");
			var gidGroundLayer = layer.getTileGIDAt(gid);
			var groundProperties = this.getPropertiesForGID(gidGroundLayer);
			
			//check for collide property
			if (groundProperties) {
				//TODO: rename walkable to collidable
				if(groundProperties.colliding) {
					return true;
				}
			}
		}
		return false;
	},
	
	getEventOnGid : function(gid) {
		if (gid) {
			var layer = this.getLayer("events");
			var gidEventLayer = layer.getTileGIDAt(gid);
			var eventProperties = this.getPropertiesForGID(gidEventLayer);

			//check for collide property
			if (eventProperties) {
				if(eventProperties.event) {
					return eventProperties.event;
				}
			}
		}
		return "noevent";
	},
	
	getArrowDirectionOnGid : function(gid) {
		if (gid) {
			var layer = this.getLayer("events");
			var gidEventLayer = layer.getTileGIDAt(gid);
			var eventProperties = this.getPropertiesForGID(gidEventLayer);

			//check for collide property
			if (eventProperties) {
				if(eventProperties.direction) {
					return eventProperties.direction;
				}
			}
		}
		return null;
	},
	
	centerPosition : function(pos) {
		var centeredX = Math.round(pos.x / this.getTileSize().width) * this.getTileSize().width;
		var centeredY = Math.round(pos.y/ this.getTileSize().height) * this.getTileSize().height;
		return cc.p(centeredX, centeredY);	
	}
});