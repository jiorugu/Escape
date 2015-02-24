animationTime = 0.1;

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MainMenuLayer();
        this.addChild(layer);
    }
});