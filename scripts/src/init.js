window.onload = function() {

    var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game', null, true, false);

    
    var Game = function (game) { };
    
    Game.Boot = function (game) { };
    
    var floorGroup, wallGroup, objectGroup, pawnGroup, cursorPos, cursor;
    
    var landGenerator, interaction, pawn;
    var slickUI;
    
    Game.Boot.prototype =
    {
        preload: function () {
            game.load.atlas('tileset', "../Procjam2018/assets/tiles/tileset.png", "../assets/tiles/tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('objects', "../Procjam2018/assets/tiles/objects-tileset.png", "../assets/tiles/objects-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('boys', "../Procjam2018/assets/tiles/boys-tileset.png", "../assets/tiles/boys-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
            slickUI.load('assets/kenney.json')

            game.time.advancedTiming = true;
    
            // Add and enable the plug-in.
            game.plugins.add(new Phaser.Plugin.Isometric(game,0));
    
            // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
            // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
            game.iso.anchor.setTo(0.5, 0.2);
        },
        create: function () {
            this.resetGame(1);
            
            // UI
            var panel;  
            slickUI.add(panel = new SlickUI.Element.Panel(32, 0, game.width - 64, 100));

            // House
            panel.add(new SlickUI.Element.Text(120, 5, "House Size"));
            
            var sizeSmall = new SlickUI.Element.Button(70, 40, 30, 30);
            panel.add(sizeSmall);
            sizeSmall.add(new SlickUI.Element.Text(0,0, "Small")).center();
            sizeSmall.events.onInputUp.add(function () {console.log('Clicked button');});
            
            var sizeMedium = new SlickUI.Element.Button(150, 40, 30, 30);
            panel.add(sizeMedium);
            sizeMedium.add(new SlickUI.Element.Text(0,0, "Medium")).center();
            sizeMedium.events.onInputUp.add(function () {console.log('Clicked button');});

            var sizeLarge = new SlickUI.Element.Button(230, 40, 30, 30);
            panel.add(sizeLarge);
            sizeLarge.add(new SlickUI.Element.Text(0,0, "Large")).center();
            sizeLarge.events.onInputUp.add(function () {console.log('Clicked button');});

            // Room Number
            panel.add(new SlickUI.Element.Text(500, 5, "Room Number"));
            
            var roomSmall = new SlickUI.Element.Button(470, 40, 30, 30);
            panel.add(roomSmall);
            roomSmall.add(new SlickUI.Element.Text(0,0, "Small")).center();
            roomSmall.events.onInputUp.add(function () {console.log('Clicked button');});
            
            var roomMedium = new SlickUI.Element.Button(550, 40, 30, 30);
            panel.add(roomMedium);
            roomMedium.add(new SlickUI.Element.Text(0,0, "Medium")).center();
            roomMedium.events.onInputUp.add(function () {console.log('Clicked button');});
            
            var roomLarge = new SlickUI.Element.Button(630, 40, 30, 30);
            panel.add(roomLarge);
            roomLarge.add(new SlickUI.Element.Text(0,0, "Large")).center();
            roomLarge.events.onInputUp.add(function () {console.log('Clicked button');});

            // Refresh
            var reset = new SlickUI.Element.Button(315, 20, 100, 50);
            panel.add(reset);
            reset.add(new SlickUI.Element.Text(0,0, "Reset")).center();

            var self = this;
            reset.events.onInputUp.add(function () { self.resetGame(0) });
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);
    
            interaction.highlightFloor(cursorPos);
            interaction.highlightWalls(cursorPos);

            pawn.update();
        },
        render: function () {
            game.debug.text("I love Kaelan");
    
        },
        resetGame: function (init) {
            if (init == 0) {
                floorGroup.destroy();
                wallGroup.destroy();
            }

            landGenerator = new LandGeneration(game);
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
    };
    
    game.state.add('Boot', Game.Boot);
    game.state.start('Boot');
}