export default class Player  {
  constructor(scene, x, y, sprite) {
    this.player = scene.physics.add.sprite(0, 250, 'player');
    this.player.setCollideWorldBounds(true);

    this.xSpeed = 160;
    this.ySpeed = -800;

    this.alive = true;
    this.facing = 'right';
    this.die();
  }

  getInstance() {
    return this.player;
  }

  increasePlayerScore() {
    this.winscore++
    localStorage.setItem('myScore', this.score);
  }
  getScore() {
    const storage = localStorage.getItem('myScore');
    if (storage) return storage
    return 0
  }

  move(direction) {
    if(this.alive){
      switch(direction){
        case 'left':
          this.facing = 'left';
          this.player.setVelocityX(-this.xSpeed);
        break;
        case 'right':
          this.facing = 'right';
          this.player.setVelocityX(this.xSpeed);
        break;
        case 'up':
          this.player.setVelocityY(this.ySpeed);
          break;
        case 'stop':
        default:
          this.player.setVelocityX(0);
      }
    }
  }

  update() {


  }

  die() {
    if(this.alive) {
      this.alive = false;
      this.player.setVisible(false);
      this.player.body.setAllowGravity(false);
      this.player.setPosition(0,0);
    }
  }

  spawn(player) {
    if(this.alive === false){
      this.alive = true;
      this.player.setVisible(true);
      this.player.body.setAllowGravity(true);
      this.player.setPosition(player.x, player.y);
    }
  }

  shoot() {
    console.log('player shooting')
  }

  //   this.body.velocity.x = 0;
  //   this.body.gravity.y = 900;
  //   if (this.cursors.left.isDown) {
  //     this.facing = "left"
  //     this.body.velocity.x = -650;
  //   }
  //   if (this.cursors.right.isDown) {
  //     this.facing = "right"
  //     this.body.velocity.x = 650;
  //   }
  //   if (this.cursors.up.isDown) {
  //     this.body.velocity.y = -650;
  //   }

  //   if (this.cursors.down.isDown) {
  //     this.body.velocity.y = 1300;
  //   }
  //   if (this.jumpButton.isDown && (this.body.onFloor() || this.body.touching.down)) {
  //     this.body.velocity.y = -550;
  //   }

  //   if (this.body.velocity.x || this.body.velocity.y) {
  //     socket.emit('clientMove', { id: socket.id(), data: { direction: this.facing, x: this.x, y: this.y } });
  //   }
  // }

}
