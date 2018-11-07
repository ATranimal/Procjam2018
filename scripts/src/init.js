window.onload = function() {

    var game = new Phaser.Game(1440, 900, Phaser.AUTO, 'game', null, true, false);

    
    var Game = function (game) { };
    
    Game.Boot = function (game) { };
    
    var floorGroup, wallGroup, objectGroup, pawnGroup, cursorPos, cursor;
    
    var landGenerator, interaction, pawn;
    var house, room, walk;
    var slickUI;
    
    Game.Boot.prototype =
    {
        preload: function () {
            game.load.atlas('tileset', "../assets/tiles/tileset.png", "../assets/tiles/tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('objects', "../assets/tiles/objects-tileset.png", "../assets/tiles/objects-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
            game.load.atlas('boys', "../assets/tiles/boys-tileset.png", "../assets/tiles/boys-tileset.json", null, Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY);
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
            house = 2;
            room = 2;
            walk = 2;
            this.resetGame(1);
            
            var self = this;
            // UI
            var panel;  
            slickUI.add(panel = new SlickUI.Element.Panel(128, 0, game.width - 128, 100));

            // House
            panel.add(new SlickUI.Element.Text(120, 5, "House Size"));
            
            var sizeSmall = new SlickUI.Element.Button(70, 40, 30, 30);
            panel.add(sizeSmall);
            sizeSmall.add(new SlickUI.Element.Text(0,0, "Small")).center();
            sizeSmall.events.onInputUp.add(function () {house = 1; self.resetGame(0);});
            
            var sizeMedium = new SlickUI.Element.Button(150, 40, 30, 30);
            panel.add(sizeMedium);
            sizeMedium.add(new SlickUI.Element.Text(0,0, "Medium")).center();
            sizeMedium.events.onInputUp.add(function () {house = 2; self.resetGame(0);});

            var sizeLarge = new SlickUI.Element.Button(230, 40, 30, 30);
            panel.add(sizeLarge);
            sizeLarge.add(new SlickUI.Element.Text(0,0, "Large")).center();
            sizeLarge.events.onInputUp.add(function () {house = 3; self.resetGame(0);});

            // Room Number
            panel.add(new SlickUI.Element.Text(400, 5, "Room Number"));
            
            var roomSmall = new SlickUI.Element.Button(370, 40, 30, 30);
            panel.add(roomSmall);
            roomSmall.add(new SlickUI.Element.Text(0,0, "Low")).center();
            roomSmall.events.onInputUp.add(function () {room = 1; self.resetGame(0);});
            
            var roomMedium = new SlickUI.Element.Button(450, 40, 30, 30);
            panel.add(roomMedium);
            roomMedium.add(new SlickUI.Element.Text(0,0, "Medium")).center();
            roomMedium.events.onInputUp.add(function () {room = 2; self.resetGame(0);});
            
            var roomLarge = new SlickUI.Element.Button(530, 40, 30, 30);
            panel.add(roomLarge);
            roomLarge.add(new SlickUI.Element.Text(0,0, "Many")).center();
            roomLarge.events.onInputUp.add(function () {room = 3; self.resetGame(0);});

            // Room Number
            panel.add(new SlickUI.Element.Text(700, 5, "Walking Speed"));

            var walkSmall = new SlickUI.Element.Button(670, 40, 30, 30);
            panel.add(walkSmall);
            walkSmall.add(new SlickUI.Element.Text(0,0, "Slow")).center();
            walkSmall.events.onInputUp.add(function () {walk = 1;});
            
            var walkMedium = new SlickUI.Element.Button(750, 40, 30, 30);
            panel.add(walkMedium);
            walkMedium.add(new SlickUI.Element.Text(0,0, "Medium")).center();
            walkMedium.events.onInputUp.add(function () {walk = 2;});
            
            var walkLarge = new SlickUI.Element.Button(830, 40, 30, 30);
            panel.add(walkLarge);
            walkLarge.add(new SlickUI.Element.Text(0,0, "Fast")).center();
            walkLarge.events.onInputUp.add(function () {walk = 3;});

            // Refresh
            var reset = new SlickUI.Element.Button(950, 20, 100, 50);
            panel.add(reset);
            reset.add(new SlickUI.Element.Text(0,0, "Reset")).center();

            reset.events.onInputUp.add(function () { self.resetGame(0) });
        },
        update: function () {
            // Update the cursor position.
            // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
            // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
            game.iso.unproject(game.input.activePointer.position, cursorPos);
    
            interaction.highlightFloor(cursorPos);
            interaction.highlightWalls(cursorPos);

            pawn.update(walk);
        },
        render: function () {
            game.debug.text("I love Kaelan");
    
        },
        resetGame: function (init) {
            if (init == 0) {
                floorGroup.destroy();
                wallGroup.destroy();
            }

            landGenerator = new LandGeneration(game, house, room);
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