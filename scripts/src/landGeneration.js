var LandGeneration = function (game) {
    this.game = game;

    // Width & Length of story
    this.floorWidth = 8;
    this.floorLength = 8;

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
    this.wallNames[11] = "wall-attic-door-closed-b";
    this.wallNames[12] = "wall-attic-door-closed-b";
    this.wallNames[13] = "wall-bathroom-door-closed-b";
    this.wallNames[14] = "wall-bedroom-door-closed-b";
    this.wallNames[15] = "wall-kitchen-door-closed-b";
    this.wallNames[16] = "wall-bedroom-door-closed-b";

    // Objects
    this.objects = [];
    this.objectGroup = this.game.add.group();
    this.objectNames = [];
    this.objectNames[0] = "empty";
    this.objectNames[1] = "object-livingroom-woodchair-b";
    this.objectNames[2] = "object-livingroom-fancychair-back-b";
    this.objectNames[3] = "object-livingroom-armchair-b";
    this.objectNames[4] = "object-kitchen-fridge-b"
    this.objectNames[5] = "object-kitchen-counter-b";
}
 
LandGeneration.prototype.generate = function() {
    // this.generateFloorHardCoded();
 
    this.initWallArray();

    
    this.generateFloor();
    this.generateWalls();
    this.generateObjects();

    this.renderTiles();

}


LandGeneration.prototype.generateFloorHardCoded = function () {
    for (var y = 0; y < this.floorLength; y++) {
        var row = [];
        for (var x = 0; x < this.floorWidth; x++) {
            row.push(0);
        }
        this.floors.push(row);
    }

    this.addRoom(3, 6, 3, 3, 6);
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
    var entranceWidth = this.randomInt(1, 3);
    // var entranceWidth = 1;
    var entranceLength = this.randomInt(2, 4);


    this.addRoom(3, this.floorLength - entranceLength, entranceWidth, entranceLength, 6);

    // Test 1
    var roomsOnFloor = this.randomInt(4, 6);
    // var roomsOnFloor = 3;

    for (var i = 0; i < roomsOnFloor; i++) {        
        
        var coordinates = this.findOpenings();
        var randomCoordinate = coordinates[this.randomInt(0, coordinates.length - 1)];
        // randomCoordinate = [5, 12, 0, -1]
        
        var xy = randomCoordinate[2];
        var direction = randomCoordinate[3];

        // for walls
        if (xy === 0) {
            if (direction == 1) {
                this.walls[randomCoordinate[1]][randomCoordinate[0]] += 10;
            }
            else {
                this.walls[randomCoordinate[1]][randomCoordinate[0] - direction] += 10;
            }
            
        }
        else {
            if (direction == 1) {
                this.walls[randomCoordinate[1]][randomCoordinate[0]] += 10;
            }
            else {
                this.walls[randomCoordinate[1] - direction][randomCoordinate[0]] += 10;
            }
        }
        
        var newX;
        var newY;
        var newWidth;
        var newLength;
        var newType;

        

        //TODO: Could optimize this by only setting variables at the end using the random coordinate trackers
        if (xy === 0) {
            newWidth = this.randomInt(1,3);

            lengthUp = this.randomInt(0, 2);
            lengthDown = this.randomInt(0, 2);
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
            newLength = this.randomInt(1, 3);

            widthLeft = this.randomInt(0, 2);
            widthRight = this.randomInt(0, 2);
            
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

LandGeneration.prototype.initWallArray = function () {
    for(var y = 0; y < this.floorLength; y++) {
        var row = [];
        for(var x = 0; x < this.floorWidth; x++) {
            row.push(0);
        }
        this.walls.push(row);
    }
}

LandGeneration.prototype.generateWalls = function () {
    // For horizontal walls
    for (var y = 0; y < this.floorLength; y++) {
        // Check the outer walls
        if (this.floors[y][0] != 0) {   
            this.walls[y][0] += 1;
        }

        for (var x = 1; x < this.floorWidth; x++) {
            if (this.floors[y][x] != this.floors[y][x-1]) {
                this.walls[y][x] += 1;
            }
        }
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
//// helper functions for procgen

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

LandGeneration.prototype.generateObjects = function () {
    for(var y = 0; y < this.floors.length; y++) {
        var row = [];
        for(var x = 0; x < this.floors[y].length; x++) {
            if (this.floors[y][x] != 0 && this.randomInt(1, 100) < 10) {
                row.push(this.randomInt(1,5));
            }
            else { 
                row.push(0);
            }
        }

        this.objects.push(row);
    }
}


LandGeneration.prototype.renderTiles = function () {  
    
    console.log(this.floors);
    console.log(this.walls);
    console.log(this.objects);

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
    // Rendering Objects
    var object;
    for (var y = 0; y < this.objects.length; y++) {
        for (var x = 0; x < this.objects[y].length; x++) {
            if (this.objects[y][x] != 0) {
                object = this.game.add.isoSprite(x * 36, y * 36, 0, 'objects', this.objectNames[this.objects[y][x]], this.wallGroup);
                object.anchor.set(0, 0);
            }
        }
    }

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
                
                if (this.walls[y][x] === 11 || this.walls[y][x] === 13 ) {
                    wall = this.game.add.isoSprite(x*36, y * 36, 0, 'tileset', this.wallNames[10 + this.floors[y][x]], this.wallGroup);
                    wall.anchor.set(0, 0.72);
                    wall.scale.x *= -1;
                }

                if (this.walls[y][x] === 12 || this.walls[y][x] === 13) {
                    wall = this.game.add.isoSprite(x * 36, y * 36, 0, 'tileset', this.wallNames[10 + this.floors[y][x]], this.wallGroup);
                    wall.anchor.set(0, 0.72);
                }
                
            }
        }
    }

    this.game.iso.simpleSort(this.wallGroup);

}