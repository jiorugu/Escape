var res = {
	Background_png : "res/background.png",
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    playerDown0 : "res/player/player_down0.png",
    player_png : "res/player/player.png",
    player_plist : "res/player/player.plist",
    arrowLeft : "res/arrowLeft.png",
    arrowRight : "res/arrowRight.png",
    arrowDown : "res/arrowDown.png",
    arrowUp : "res/arrowUp.png",
    arrowPressed : "res/arrowPressed.png",
    map1 : "res/maps/test1.tmx",
    mapIce : "res/maps/test2.tmx"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}