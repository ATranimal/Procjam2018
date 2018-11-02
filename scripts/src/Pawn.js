var Pawn = function (game, landGenerator) {
    this.game = game;
    this.pawn;
    this.landGenerator = landGenerator;

    this.coordinates = [3, this.landGenerator.floorLength - 1];
    this.visitedFloor = [];

    this.pawnGroup = this.game.add.group()

    this.time = this.game.time.now;
}

Pawn.prototype.init = function init() {
    // Create Sprite
    this.pawn = this.game.add.isoSprite(3 * 36, (this.coordinates[1]) * 36, 1, 'boys', 'happy1-back', this.landGenerator.wallGroup);
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
    if (y != this.coordinates[1]) {
        this.coordinates[1] = y;
    }
    else if (x != this.coordinates[0]) {
        this.coordinates[0] = x;
    }

    if (x - this.coordinates[1] < 0 || y - this.coordinates[0] < 0) {
        this.pawn.animations.play('happy-walk-back');
    }
    else {
        this.pawn.animations.play('happy-walk');
    }

    var tween = this.game.add.tween(this.pawn).to({ isoY: this.coordinates[1] * 36, isoX: this.coordinates[0] * 36 }, 3000, Phaser.Easing.Quadratic.InOut, true);

    this.addVisitedFloor(this.coordinates[0], this.coordinates[1]);
}


////
// #START REGION UPDATE


Pawn.prototype.update = function () {
    if (this.game.time.now - this.time > 6000) {
        this.time = this.game.time.now;;

        //// RNG DIFFERENT ACTIONS

        // Explore Room

        // Move to different room
    }
}