var LandGeneration = function (game) {
    this.game = game;

    // Create a group for our tiles.
    this.isoGroup = this.game.add.group();
}


LandGeneration.prototype.drawTiles = function () {
    var tile;
    for (var xx = 0; xx < 289; xx += 36) {
        for (var yy = 0; yy < 256; yy += 36) {
            // Create a tile using the new game.add.isoSprite factory method at the specified position.
            // The last parameter is the group you want to add it to (just like game.add.sprite)
            tile = this.game.add.isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
            tile.anchor.set(0.5, 0);
        }
    }
}