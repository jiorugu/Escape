var TileMap = cc.TMXTiledMap.extend({
	ctor: function(mapFile) {
		this._super();
		this.initWithTMXFile(mapFile);
	},

	getTileCoordForPos : function(position) {
		var x = Math.floor(position.x / this.getTileSize().width);
		var y = Math.floor(((this.getTileSize().height * 
				this.getMapSize().height) - position.y) 
				/ this.getTileSize().height);
		return new cc.p(x, y);
	},

	isCollidable : function(tileCoord) {
		//TODO: collision detection
		return false;
	},
	
});