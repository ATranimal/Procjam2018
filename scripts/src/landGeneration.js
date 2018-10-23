var LandGeneration = function (game) {
    this.game = game;
    this.floor;

    this.floorGroup = this.game.add.group();

    this.floorNames = [];
    this.floorNames[0] = "empty";
    this.floorNames[1] = "wood";
    this.floorNames[2] = "tile";
}
 
LandGeneration.prototype.generateFloor = function () {
    this.floor = [
        [1, 1, 1, 2, 2, 1, 1, 1], 
        [1, 2, 2, 2, 2, 1, 2, 1], 
        [1, 1, 1, 2, 2, 1, 1, 1], 
        [1, 1, 1, 1, 2, 1, 1, 1], 
        [1, 1, 1, 2, 2, 1, 1, 1], 
        [1, 1, 1, 1, 2, 1, 2, 1], 
        [1, 1, 1, 2, 2, 1, 1, 1], 
        [1, 1, 1, 2, 1, 1, 1, 2], 
    ]
}

LandGeneration.prototype.drawTiles = function () {  
    var tile;

    for (var y = 0; y < this.floor.length; y++) {
        for (var x = 0; x < this.floor[y].length; x++) {
            // This will add an isosprite sat its correct x,y  value, and look up the correct tile name based on the value in the floor grid
            tile = this.game.add.isoSprite(x * 36, y * 36, 0, this.floorNames[this.floor[y][x]], 0, this.floorGroup);
            tile.anchor.set(0.5, 0);
        } 
    }
}