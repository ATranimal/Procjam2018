var Pawn = function (game, landGenerator) {
    this.game = game;
    this.pawn;
    this.landGenerator = landGenerator;
    this.walk = 2;

    this.coordinates = [3 * this.landGenerator.house, this.landGenerator.floorLength - 1];
    this.visitedFloor = [];

    this.pawnGroup = this.game.add.group()

    this.time = this.game.time.now;
}

Pawn.prototype.init = function init() {
    // Create Sprite
    this.pawn = this.game.add.isoSprite(this.coordinates[0] * 36, (this.coordinates[1]) * 36, 1, 'boys', 'happy1-back', this.landGenerator.wallGroup);
    this.pawn.anchor.set(0.5, 0.5);

    // Instantiate Visited Floor;
    for (var i = 0; i < this.landGenerator.floorLength; i++) {
        var row = [];
        for (var j = 0; j < this.landGenerator.floorWidth; j++) {
            row.push(0);
        }
        this.visitedFloor.push(row);
    }

    // Visited Floor
    this.addVisitedFloor(this.coordinates[0], this.coordinates[1])

    // Animations
    this.pawn.animations.add('happy-walk', ["happy1", "happy2"], 2, true);
    this.pawn.animations.add('happy-walk-back', ["happy1-back", "happy2-back"], 2, true);

    this.pawn.animations.play('happy-walk');
}

Pawn.prototype.addVisitedFloor = function(x, y) {
    this.visitedFloor[y][x] = 1;
}

Pawn.prototype.move = function(x, y) {
    // console.log(x-this.coordinates[1]);
    // console.log(y-this.coordinates[0]);
    if (x - this.coordinates[0] < 0) {
        this.pawn.animations.play('happy-walk-back');
    }
    else if (y - this.coordinates[1] < 0) {
        this.pawn.animations.play('happy-walk-back');
    }
    else {
        this.pawn.animations.play('happy-walk');
    }

    if (y != this.coordinates[1]) {
        this.coordinates[1] = y;
    }
    else if (x != this.coordinates[0]) {
        this.coordinates[0] = x;
    }

    var self = this;
    var tween = this.game.add.tween(this.pawn).to({ isoY: this.coordinates[1] * 36, isoX: this.coordinates[0] * 36 }, 1000 / this.walk, Phaser.Easing.Quadratic.InOut, true);
    tween.onComplete.add(function () {
        self.game.iso.simpleSort(self.landGenerator.wallGroup);
    });

    this.addVisitedFloor(this.coordinates[0], this.coordinates[1]);
    
}

Pawn.prototype.setWalk = function(walk) {
    this.walk = walk;
}
////
// #START REGION UPDATE


Pawn.prototype.update = function (walk) {
    this.walk = walk;
    if (this.game.time.now - this.time > 1500 / this.walk) {
        this.time = this.game.time.now;;


        // Explore Room
        var adjacentTiles = [];
        if (this.coordinates[0] - 1 >= 0){
            adjacentTiles.push([this.coordinates[0]-1, this.coordinates[1]]);
        }
        if (this.coordinates[0] + 1 < this.landGenerator.floorWidth){
            adjacentTiles.push([this.coordinates[0]+1, this.coordinates[1]]);
        }
        if (this.coordinates[1] - 1 >= 0){
            adjacentTiles.push([this.coordinates[0], this.coordinates[1]-1]);
        }
        if (this.coordinates[1] + 1 < this.landGenerator.floorLength){
            adjacentTiles.push([this.coordinates[0], this.coordinates[1]+1]);
        }

        // 1. Check if there is a door and unexplored room of different type 
        var roomMove = [];
        for (var i = 0; i < adjacentTiles.length; i++) {
            var x = adjacentTiles[i][0];
            var y = adjacentTiles[i][1];
            // Check different floor
            if (this.landGenerator.floors[y][x] != this.landGenerator.floors[this.coordinates[1]][this.coordinates[0]] && this.landGenerator.floors[y][x] != 0) {
                // Check door on current and lower levels
                if (this.landGenerator.walls[this.coordinates[1]][this.coordinates[0]] > 10) {
                    roomMove.push([x, y]);
                }
                else if (x - this.coordinates[0] == 1) {
                    if ( this.landGenerator.walls[y][x] == 11 || this.landGenerator.walls[y][x] == 13 ) {
                        roomMove.push([x, y]);
                    }
                }
                else if (y - this.coordinates[1] == 1 ) {
                    if ( this.landGenerator.walls[y][x] == 12 || this.landGenerator.walls[y][x] == 13 ) {
                        roomMove.push([x, y]);
                    }
                }
            }
        }

        // 2. Check if the floor type is the same
        var validTiles = [];
        for (var i = 0; i < adjacentTiles.length; i++) {
            var x = adjacentTiles[i][0];
            var y = adjacentTiles[i][1];
            if (this.landGenerator.floors[y][x] == this.landGenerator.floors[this.coordinates[1]][this.coordinates[0]] ) {
                validTiles.push([ x, y ]);
            }
        }

        // 3. randomize between floor types including the visited room value in the rng
        var unvisitedFloors = [];
        for (var i = 0; i < validTiles.length; i++) {
            var x = validTiles[i][0];
            var y = validTiles[i][1];
            if (this.visitedFloor[y][x] == 0) {
                unvisitedFloors.push([x, y]);
            }
        }

        var moved = false;
        if (roomMove.length > 0) {
            // If the room move is unvisited, do that action
            if (this.visitedFloor[roomMove[0][1]][roomMove[0][0]] == 0) {
                this.move(roomMove[0][0], roomMove[0][1]);
                moved = true;
            } 
            // Else add it to the pool of valid moves
            else {
                validTiles.push([roomMove[0][0], roomMove[0][1]])
            }
        }

        if (!moved) {
            if (unvisitedFloors.length != 0) {
                var choice = this.landGenerator.randomInt(0, unvisitedFloors.length - 1);
                this.move(unvisitedFloors[choice][0], unvisitedFloors[choice][1]);
            }
    
    
            else if (validTiles.length != 0) {
                var choice = this.landGenerator.randomInt(0, validTiles.length - 1);
                this.move(validTiles[choice][0], validTiles[choice][1]);
            }
        }
    }
}