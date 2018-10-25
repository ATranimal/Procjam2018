var LandGeneration = function (game) {
    this.game = game;

    // Width & Length of story
    this.floorWidth = 16;
    this.floorLength = 16;

    //////////
    // There will be 3 isogroups per story : Floor, Walls, Objects
    this.floors = [];
    this.floorGroup = this.game.add.group();
    this.floorNames = [];
    this.floorNames[0] = "empty";
    this.floorNames[1] = "floor-attic-b";
    this.floorNames[2] = "floor-basement-b"; 
    this.floorNames[3] = "floor-bathroom-b";
    this.floorNames[4] = "floor-bedroom-b";
    this.floorNames[5] = "floor-kitchen-b";
    this.floorNames[6] = "floor-livingroom-b";

    // Walls
    this.walls = [];
    this.wallGroup = this.game.add.group();
    this.wallNames = [];
    this.wallNames[0] = "empty";
    this.wallNames[1] = "wall-attic-b";
    this.wallNames[2] = "wall-attic-b"; 
    this.wallNames[3] = "wall-bathroom-b";
    this.wallNames[4] = "wall-bedroom-b";
    this.wallNames[5] = "wall-kitchenw-b";
    this.wallNames[6] = "wall-bedroom-b";


    // Objects
}
 
LandGeneration.prototype.generate = function() {
    // this.generateFloorHardCoded();
    this.generateFloor();
 
    this.generateWalls();


    this.renderTiles();

}


LandGeneration.prototype.generateFloorHardCoded = function () {
    this.floors = [
        [0, 0, 0, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [1, 1, 0, 0, 1],
        [1, 1, 0, 0, 1],
    ]
}

LandGeneration.prototype.generateFloor = function () {
    // First filling the array with 0s
    for (var y = 0; y < this.floorLength; y++) {
        var row = [];
        for (var x = 0; x < this.floorWidth; x++) {
            row.push(0);
        }
        this.floors.push(row);
    }

    // // Entrance hallway
    // var entranceWidth = this.randomInt(2, 6);
    // var entranceLength = this.randomInt(4, 10);
    var entranceWidth = 4;
    var entranceLength = 6;


    this.addRoom(6, 16 - entranceLength, entranceWidth, entranceLength, 6);

    // Test 1
    var roomsOnFloor = this.randomInt(9, 12);
    // var roomsOnFloor = 0;

    for (var i = 0; i < roomsOnFloor; i++) {        
        
        var coordinates = this.findOpenings();
        var randomCoordinate = coordinates[this.randomInt(0, coordinates.length - 1)];
        // randomCoordinate = [5, 12, 0, -1]
        
        var xy = randomCoordinate[2];
        var direction = randomCoordinate[3];
        
        var newX;
        var newY;
        var newWidth;
        var newLength;
        var newType;

        //TODO: Could optimize this by only setting variables at the end using the random coordinate trackers
        if (xy === 0) {
            newWidth = this.randomInt(2, 6);

            lengthUp = this.randomInt(0, 3);
            lengthDown = this.randomInt(0, 3);
            newLength = 1 + lengthUp + lengthDown
            // newWidth = 4;
            // lengthUp = 2;
            // lengthDown = 1;
            // newLength = 1 + lengthUp + lengthDown; 
            
            newY = randomCoordinate[1] - lengthUp;
            if (direction === 1) {
                newX = randomCoordinate[0];
            }
            else if (direction === -1) {
                newX = randomCoordinate[0] - newWidth + 1;
            }
        }
        else if (xy == 1) {
            newLength = this.randomInt(2, 6);

            widthLeft = this.randomInt(0, 3);
            widthRight = this.randomInt(0, 3);
            
            newWidth = 1 + widthLeft + widthRight;

            // newLength = 4;
            // widthLeft = 2;
            // widthRight = 1;
            // newWidth  = 1 + widthLeft + widthRight
            newX = randomCoordinate[0] - widthLeft;
            if (direction === 1) {
                newY = randomCoordinate[1];
            }
            else if (direction === -1) {
                newY = randomCoordinate[1] - newLength + 1
            }
        }

        newType = this.randomInt(1, 6);

        this.addRoom(newX, newY, newWidth, newLength, newType);
    }
}

LandGeneration.prototype.generateWalls = function () {
    // For horizontal walls
    for (var y = 0; y < this.floorLength; y++) {
        var row = [];

        // Check the outer walls
        if (this.floors[y][0] != 0) {   
            row.push(1);
        }
        else {
            row.push(0);
        }

        for (var x = 1; x < this.floorWidth; x++) {
            if (this.floors[y][x] != this.floors[y][x-1]) {
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
        if (this.floors[0][x] != 0) {
            this.walls[0][x] += 2;
        }
        for (var y = 1; y < this.floorLength; y++) {
            if (this.floors[y][x] != this.floors[y-1][x]) {
                this.walls[y][x] += 2;
            }
        }
    }
}

//// #START REGION
//// helper functions for procegn

// Helper function for creating a random int
LandGeneration.prototype.randomInt = function(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

// note that this starts from the top left as 0, 0, width goes right and length goes down
LandGeneration.prototype.addRoom = function(x, y, width, length, type) {

    console.log("New room generated from coordinates (" + x + ", " + y + "), with width " + width + " and length " + length + ". Type: " + this.floorNames[type]);

    for (var i = x; i < x + width; i++) {
        if (i > 0 && i < this.floorWidth) {
            for (var j = y; j < y + length; j++) {
                if (j > 0 && j < this.floorLength) {
                    if (this.floors[j][i] === 0) {
                        this.floors[j][i] = type;
                    }
                }
            }
        }
    }
}

LandGeneration.prototype.findOpenings = function() {
    // Strcture = [x, y, (horz-0 or vert-1), (direction to grow array1, opposite-1)
    var coordinates = []

     // For horizontal walls
     for (var y = 0; y < this.floorLength; y++) {
        for (var x = 1; x < this.floorWidth; x++) {
            if (this.floors[y][x] != 0 && this.floors[y][x-1] === 0) {
                var opening = [x-1, y, 0, -1];
                coordinates.push(opening);
            }
            else if (this.floors[y][x] === 0 && this.floors[y][x-1] != 0) {
                var opening = [x, y, 0, 1];
                coordinates.push(opening);
            }
        }
    }

     // For vertical walls
     for (var y = 1; y < this.floorLength; y++) {
        for (var x = 0; x < this.floorWidth; x++) {
            if (this.floors[y][x] != 0 && this.floors[y-1][x] === 0) {
                var opening = [x, y-1, 1, -1];
                coordinates.push(opening);
            }
            else if (this.floors[y][x] === 0 && this.floors[y-1][x] != 0) {
                var opening = [x, y, 1, 1];
                coordinates.push(opening);
            }
        }
    }

    return coordinates
}
//// #END REGION


LandGeneration.prototype.renderTiles = function () {  
    // Rendering the floor
    var tile;
    for (var y = 0; y < this.floors.length; y++) {
        for (var x = 0; x < this.floors[y].length; x++) {
            if (this.floors[y][x] != 0) {
                // This will add an isosprite sat its correct x,y  value, and look up the correct tile name based on the value in the floor grid
                tile = this.game.add.isoSprite(x * 36, y * 36, 0, 'tileset', this.floorNames[this.floors[y][x]], this.floorGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }

    console.log("floor is: ");
    console.log(this.floors);
    // Rendering the wall
    var wall;
    for (var y = 0; y < this.walls.length; y++) {
        for (var x = 0; x < this.walls[y].length; x++) {
            if (this.floors[y][x] != 0) {
                // top left wall
                if (this.walls[y][x] === 1 || this.walls[y][x] === 3) {
                    wall = this.game.add.isoSprite(x * 36, y * 36, 0, 'tileset', this.wallNames[this.floors[y][x]], this.wallGroup);
                    wall.anchor.set(0, 0.72);
                    wall.scale.x *= -1;
                }
                // top right wall
                if (this.walls[y][x] === 2 || this.walls[y][x] === 3) {
                    wall = this.game.add.isoSprite(x * 36, y * 36, 0, 'tileset', this.wallNames[this.floors[y][x]], this.wallGroup);
                    wall.anchor.set(0, 0.72);
                }
            }
        }
    }
}