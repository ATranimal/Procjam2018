var Pawn = function (game) {
    this.game = game;
    this.pawn;

}

Pawn.prototype.init = function init() {
    this.pawn = this.game.add.isoSprite(108, 288, 0, 'boys', 'happy1-back');
    this.pawn.anchor.set(0.5, 0.5);

    this.pawn.animations.add('happy-walk', ["happy1", "happy2"], 2, true);
    this.pawn.animations.add('happy-walk-back', ["happy1-back", "happy2-back"], 2, true);

    this.pawn.animations.play('happy-walk');
}