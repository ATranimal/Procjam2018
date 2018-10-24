var LandGeneration = function (game) {
    this.game = game;

    // Width & Length of story
    this.floorWidth = 5;
    this.floorLength = 5;

    //////////
    // There will be 3 isogroups per story : Floor, Walls, Objects
    this.floor = [];
    this.floorGroup = this.game.add.group();
    this.floorNames = [];
    this.floorNames[0] = "wood";
    this.floorNames[1] = "tile";

    // Walls
    this.walls = [];
    this.wallGroup = this.game.add.group();
    this.wallNames = [];
    this.wallNames[0] = "sw_blue";

    // Objects
}
 
LandGeneration.prototype.generate = function() {
    this.generateFloorHardCoded();
    // this.generateFloor();
 
    this.generateWalls();


    this.renderTiles();

}


LandGeneration.prototype.generateFloorHardCoded = function () {
    this.floor = [
        [0, 0, 0, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [1, 1, 0, 0, 1],
        [1, 1, 0, 0, 1],
    ]
}

LandGeneration.prototype.generateFloor = function () {
    for (var y = 0; y < this.floorLength; y++) {
        var row = [];
        for (var x = 0; x < this.floorWidth; x++) { 
            row.push( Math.round(Math.random() * this.floorNames.length) );
            console.log(row);
        }
        this.floor.push(row);
    }
    console.log(this.floor);
}

LandGeneration.prototype.generateWalls = function () {
    // For horizontal walls
    for (var y = 0; y < this.floorLength; y++) {
        var row = [];

        // Check the outer walls
        if (this.floor[y][0] != 0) {   
            row.push(1);
        }
        else {
            row.push(0);
        }

        for (var x = 1; x < this.floorWidth; x++) {
            if (this.floor[y][x] != this.floor[y][x-1]) {
                row.push(1);
            }
            else {
                row.push(0);
            }
        }
        this.walls.push(row);
    }

    // For vertical walls
    for (var x = 0; x < this.floorWidth; x++) {
        if (this.floor[0][x] != 0) {
            this.walls[0][x] += 2;
        }
        for (var y = 1; y < this.floorLength; y++) {
            if (this.floor[y][x] != this.floor[y-1][x]) {
                this.walls[y][x] += 2;
            }
        }
    }
}

LandGeneration.prototype.renderTiles = function () {  
    // Rendering the floor
    var tile;
    for (var y = 0; y < this.floor.length; y++) {
        for (var x = 0; x < this.floor[y].length; x++) {
            // This will add an isosprite sat its correct x,y  value, and look up the correct tile name based on the value in the floor grid
            tile = this.game.add.isoSprite(x * 36, y * 36, 0, this.floorNames[this.floor[y][x]], 0, this.floorGroup);
            tile.anchor.set(0.5, 0);
        } 
    }

    console.log(this.walls);
}