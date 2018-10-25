var InteractionManager = function (game, floorGroup, wallGroup) {
    this.game = game;
    this.floorGroup = floorGroup;
    this.wallGroup = wallGroup;
}

InteractionManager.prototype.highlightFloor = function (cursorPos) {
    //for javascript scoping (Ffs)
    var self = this;

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    this.floorGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
        // If it does, do a little animation and tint change.
        if (!tile.selected && inBounds) {
            tile.selected = true;
            tile.tint = 0x86bfda;
            self.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
        // If not, revert back to how it was.
        else if (tile.selected && !inBounds) {
            tile.selected = false;
            tile.tint = 0xffffff;
            self.game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    });
}

InteractionManager.prototype.highlightWalls = function (cursorPos) {
    var self = this;

    this.wallGroup.forEach(function (wall) {
        var x = wall.isoPosition.x;
        var y = wall.isoPosition.y;

        var radius = 75;
        var inBounds = x < cursorPos.x + radius && x > cursorPos.x - radius && y > cursorPos.y - radius && y < cursorPos.y + radius;
        if (!wall.selected && inBounds) {
            wall.selected = true;            
            self.game.add.tween(wall).to({ alpha: 0 }, 500, Phaser.Easing.Quadratic.InOut, true);
        }
        else if (wall.selected && !inBounds) {
            wall.selected = false;
            self.game.add.tween(wall).to({ alpha: 1 }, 500, Phaser.Easing.Quadratic.InOut, true);
        }
    });

}