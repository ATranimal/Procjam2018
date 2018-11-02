var Pawn = function (game) {
    this.game = game;
    this.pawn;

}

Pawn.prototype.init = function init() {
    pawn = this.game.add.isoSprite(0, 0, 0, 'boys', 'happy1-back');
}