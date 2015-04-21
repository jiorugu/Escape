animationTime = 0.1;
DoorState = {
		OPEN : 1,
		CLOSED : 0
};

var MainMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});