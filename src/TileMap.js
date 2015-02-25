var TileMap = cc.TMXTiledMap.extend({
	ctor: function(mapFile) {
		this._super();
		this.initWithTMXFile(mapFile);
	},

	getTileCoordForPos : function(pos) {
		var x = Math.floor(pos.x / this.getTileSize().width);
		//subtract by 1 -> workaround for cocos2d offset problem
		var y = Math.floor((((this.getTileSize().height * 
				this.getMapSize().height) - pos.y) 
				/ this.getTileSize().height) - 1);
		return new cc.p(x, y);
	},
	
	isCollidable : function(gid) {
		if (gid) {
			var layer = this.getLayer("ground");
			var gidGroundLayer = layer.getTileGIDAt(gid);
			var groundProperties = this.getPropertiesForGID(gidGroundLayer);
			
			//check for collide property
			if (groundProperties) {
				//TODO: rename walkable to collidable
				if(groundProperties.walkable) {
					return true;
				}
			}
		}
		return false;
	}
});