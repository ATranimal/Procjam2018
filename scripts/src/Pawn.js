var Pawn = function (game, landGenerator) {
    this.game = game;
    this.pawn;
    this.landGenerator = landGenerator;

    this.coordinates = [3, this.landGenerator.floorLength - 1];
    this.visitedFloor = [];

    this.pawnGroup = this.game.add.group()
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

Pawn.prototype.move = function(direction) {
    if (direction == "up") {
        this.pawn.animations.play('happy-walk-back');
        this.coordinates[1] -= 1;
    }
    else if (direction == "down") {
        this.pawn.animations.play('happy-walk');
        this.coordinates[1] += 1;
    }
    else if (direction == "left") {
        this.pawn.animations.play('happy-walk-back');
        this.coordinates[0] -= 1;
    }
    else if (direction == "right") {
        this.pawn.animations.play('happy-walk');
        this.coordinates[0] += 1;
    }
    
    var self = this;
    var tween = this.game.add.tween(this.pawn).to({ isoY: this.coordinates[1] * 36, isoX: this.coordinates[0] * 36 }, 4000, Phaser.Easing.Quadratic.InOut, true);
    tween.onComplete.add(function () {
        self.game.iso.simpleSort(self.landGenerator.wallGroup);
    });

    this.addVisitedFloor(this.coordinates[0], this.coordinates[1]);
}