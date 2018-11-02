window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', null, true, false);
    
    var Game = function (game) { };
    
    Game.Boot = function (game) { };
    
    var floorGroup, wallGroup, objectGroup, pawnGroup, cursorPos, cursor;
    
    var landGenerator, interaction, pawn;
    
    Game.Boot.prototype =
    {
        preload: function () {
            game.load.atlas('tileset', "../assets/tiles/tileset.png", "../assets/tiles/tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('objects', "../assets/tiles/objects-tileset.png", "../assets/tiles/objects-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('boys', "../assets/tiles/boys-tileset.png", "../assets/tiles/boys-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);


            game.time.advancedTiming = true;
    
            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game,0));
    
            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);
        },
        create: function () {
            //Instantiate land generator
            landGenerator = new LandGeneration(game);
            // Let's make a load of tiles on a grid.
            landGenerator.generate();
            floorGroup = landGenerator.floorGroup;
            wallGroup = landGenerator.wallGroup;
            // objectGroup = landGenerator.objectGroup;

            // Instantiate Pawn
            pawn = new Pawn(game, landGenerator);
            pawn.init();
            pawnGroup = pawn.pawnGroup;

            // Instantiate Interaction Manager
            interaction = new InteractionManager(game, floorGroup, wallGroup);
            game.iso.simpleSort(wallGroup);
            // Provide a 3D position for the cursor
            cursorPos = new Phaser.Plugin.Isometric.Point3();
        },
        update: function () {
            
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);
    
            interaction.highlightFloor(cursorPos);
            interaction.highlightWalls(cursorPos);
        },
        render: function () {
            game.debug.text("I love Kaelan");
    
        },
    };
    
    game.state.add('Boot', Game.Boot);
    game.state.start('Boot');
}