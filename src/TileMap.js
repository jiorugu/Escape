var TileMap = cc.TMXTiledMap.extend({
	ctor: function(mapFile) {
		this._super();
		this.initWithTMXFile(mapFile);
		
		this.crumblies = {};
		this.gusts = [];
	},

	getTileCoordForPos : function(pos) {
		var x = Math.floor(pos.x / this.getTileSize().width);
		var y = Math.floor(((this.getTileSize().height * 
				this.getMapSize().height) - pos.y) 
				/ this.getTileSize().height);
		//subtract by 1 -> workaround for cocos2d offset problem
		return new cc.p(x, y-1);
	},

	isCollidable : function(pos) {
		var gid = this.getTileCoordForPos(pos);
		if (gid) {
			var tileID = this.getTileIDforGid(gid);
			var tile = this.getTileGidforPos("ground", gid);
			var groundProperties = this.getPropertiesForGID(tile);
			
			//check for collide property
			if (groundProperties) {
				//TODO: rename walkable to collidable
				if(groundProperties.colliding) {
					return true;
				}
			} else if(this.crumblies[tileID] == "collidable") {
				return true;
			}
		}
		return false;
	},

	getEventOnGid : function(gid) {
		if (gid) {
			var tile = this.getTileGidforPos("events", gid);
			var eventProperties = this.getPropertiesForGID(tile);

			//check for collide property
			if (eventProperties) {
				if(eventProperties.event) {
					return eventProperties.event;
				}
			}
			
			for(var i = 0; i < this.gusts.length; i++) {
				if(this.gusts[i].pos.x == gid.x && this.gusts[i].pos.y == gid.y) {
					return "gust";
				}
			}
		}
		return "noevent";
	},

	getArrowDirectionOnGid : function(gid) {
		if (gid) {
			var eventLayer = this.getLayer("events");
			var tile = eventLayer.getTileGIDAt(gid);
			var eventProperties = this.getPropertiesForGID(tile);

			//check for collide property
			if (eventProperties) {
				if(eventProperties.direction) {
					return eventProperties.direction;
				}
			}
		}
		return null;
	},

	checkIfLeavingCrumblyTile : function(gid) {
		if(this.getEventOnGid(gid) == "crumbly") {
			var eventLayer = this.getLayer("events");
			var sprite = eventLayer.getTileAt(gid);
			eventLayer.removeChild(sprite);
			
			var tileID = this.getTileIDforGid(gid);
		
			this.crumblies[tileID] = "collidable";
			return true;
		}
		return false;
	},
	
	getTileGidforPos : function(layer, pos) {
		var layer = this.getLayer(layer);	
		return tile = layer.getTileGIDAt(pos);
	},
	
	getTileIDforGid : function(gid) {
		var id = gid.y * this._getMapWidth() + gid.x;
		return id;
	},

	centerPosition : function(pos) {
		var centeredX = Math.round(pos.x / this.getTileSize().width) * this.getTileSize().width;
		var centeredY = Math.round(pos.y / this.getTileSize().height) * this.getTileSize().height;
		return cc.p(centeredX, centeredY);	
	}
});