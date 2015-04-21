var TileMap = cc.TMXTiledMap.extend({
	ctor: function(mapFile) {
		this._super();
		this.initWithTMXFile(mapFile);
		
		this.crumblies = {};
		this.gusts = [];
		// 1 = open, 0 = closed
		this.trapdoors = [];
	},

	isCollidable : function(pos) {
		var coord = this.getTileCoordForPos(pos);
		if (coord) {
			var tileID = this.getTileIDforCoord(coord);
			var tile = this.getTileGidforCoord("ground", coord);
			var groundProperties = this.getPropertiesForGID(tile);
			
			//check for collide property
			if (groundProperties) {
				//TODO: rename walkable to collidable
				if(groundProperties.colliding) {
					return true;
				}
			} else if(this.crumblies[tileID] == "collidable") {
				return true;
			} else {
				//check if colliding with open trapdoor
				for(var i = 0; i < this.trapdoors.length; i++) {
					if((this.trapdoors[i].pos.x == coord.x && this.trapdoors[i].pos.y == coord.y) 
						&& this.trapdoors[i].sprite.state == DoorState.OPEN) 
					{
						return true;
					}
				}
			}
		}
		return false;
	},

	getEventOnPos : function(pos) {
		var coord = this.getTileCoordForPos(pos);
		if (coord) {
			var tile = this.getTileGidforCoord("events", coord);
			var eventProperties = this.getPropertiesForGID(tile);

			//check for collide property
			if (eventProperties) {
				if(eventProperties.event) {
					return eventProperties.event;
				}
			}
			
			//handle gusts objects as event
			for(var i = 0; i < this.gusts.length; i++) {
				if(this.gusts[i].pos.x == coord.x && this.gusts[i].pos.y == coord.y) {
					return "gust";
				}
			}
		}
		return "noevent";
	},

	getArrowDirectionOnPos : function(pos) {
		var coord = this.getTileCoordForPos(pos);
		if (coord) {
			var eventLayer = this.getLayer("events");
			var tile = eventLayer.getTileGIDAt(coord);
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

	checkIfLeavingCrumblyTile : function(pos) {
		var coord = this.getTileCoordForPos(pos);
		if(this.getEventOnPos(pos) == "crumbly") {
			var eventLayer = this.getLayer("events");
			var sprite = eventLayer.getTileAt(coord);
			eventLayer.removeChild(sprite);
			
			var tileID = this.getTileIDforCoord(coord);
		
			this.crumblies[tileID] = "collidable";
			return true;
		}
		return false;
	},
	
	checkIfLeavingIceTile : function(pos) {
		if(this.getEventOnPos(pos) == "ice") {
			return true;
		}
		return false;
	},
	
	getTileGidforCoord : function(layer, pos) {
		var layer = this.getLayer(layer);	
		return tile = layer.getTileGIDAt(pos);
	},
	
	getTileIDforCoord : function(coord) {
		var id = coord.y * this._getMapWidth() + coord.x;
		return id;
	},

	getTileCoordForPos : function(pos) {
		var x = Math.floor(pos.x / this.getTileSize().width);
		var y = Math.floor(((this.getTileSize().height * 
				this.getMapSize().height) - pos.y) 
				/ this.getTileSize().height);
		//subtract by 1 -> workaround for cocos2d offset problem
		return new cc.p(x, y-1);
	},

	centerPosition : function(pos) {
		var centeredX = Math.round(pos.x / this.getTileSize().width) * this.getTileSize().width;
		var centeredY = Math.round(pos.y / this.getTileSize().height) * this.getTileSize().height;
		return cc.p(centeredX, centeredY);	
	}
});