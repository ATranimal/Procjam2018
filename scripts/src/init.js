window.onload = function() {

    var game = new Phaser.Game(800, 400, Phaser.AUTO, 'test', null, true, false);
    
    var Game = function (game) { };
    
    Game.Boot = function (game) { };
    
    var floorGroup, cursorPos, cursor;
    
    
    Game.Boot.prototype =
    {
        preload: function () {
            game.load.image('wood', '../assets/tiles/ClintTest.png');
            game.load.image('tile', '../assets/tiles/KaelanTest.png');
    
            game.time.advancedTiming = true;
    
            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game,0));
    
            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);
        },
        create: function () {
            //Instantiate land generator
            var landGenerator = new LandGeneration(game);
            // Let's make a load of tiles on a grid.
            landGenerator.generateFloor();
            landGenerator.drawTiles();
            floorGroup = landGenerator.floorGroup;
            console.log(floorGroup);
    
            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);
    
            // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
            floorGroup.forEach(function (tile) {
                var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
                // If it does, do a little animation and tint change.
                if (!tile.selected && inBounds) {
                    tile.selected = true;
                    tile.tint = 0x86bfda;
                    game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
                }
                // If not, revert back to how it was.
                else if (tile.selected && !inBounds) {
                    tile.selected = false;
                    tile.tint = 0xffffff;
                    game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
                }
            });
        },
        render: function () {
            game.debug.text("I love Kaelan");
    
        },
    };
    
    game.state.add('Boot', Game.Boot);
    game.state.start('Boot');
}