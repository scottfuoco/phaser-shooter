export default class BadGuy {
  constructor(scene, id, x, y, sprite) {
    // this.player = scene.physics.add.sprite(x, y, sprite);
    console.log(scene.sys.game.config.width / 2)
    this.player = scene.physics.add.sprite(scene.sys.game.config.width / 2, scene.sys.game.config.height / 2, 'dj');
    this.player.setCollideWorldBounds(true);
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
