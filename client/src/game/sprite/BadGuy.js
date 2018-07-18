export default class BadGuy {
  constructor(scene, id, x, y, sprite) {
    this.player = scene.physics.add.sprite(x, y, sprite);
    this.player.playerId = id;
  }

  getInstance() {
    return this.player;
  }

  die() {
    if(this.alive) {
      this.alive = false;
      this.player.setVisible(false);
      this.player.body.setAllowGravity(false);
      this.player.setPosition(0,0);
    }
  }
}
