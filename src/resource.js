var res = {
	Background_png : "res/background.png",
    playerDown0 : "res/player/player_down0.png",
    player_png : "res/player/player.png",
    player_plist : "res/player/player.plist",
    portal_png : "res/animations/portal.png",
    portal_plist : "res/animations/portal.plist",
    boulder_png : "res/animations/boulder.png",
    boulder_plist : "res/animations/boulder.plist",
    crumbly_png : "res/animations/crumbly.png",
    crumbly_plist : "res/animations/crumbly.plist",
    arrowLeft : "res/gui/arrowLeft.png",
    arrowRight : "res/gui/arrowRight.png",
    arrowDown : "res/gui/arrowDown.png",
    arrowUp : "res/gui/arrowUp.png",
    arrowPressed : "res/gui/arrowPressed.png",
    pauseButton : "res/gui/pauseButton.png",
    map1 : "res/maps/test1.tmx",
    map2 : "res/maps/test2.tmx",
    map3 : "res/maps/test-ice-rock.tmx",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}