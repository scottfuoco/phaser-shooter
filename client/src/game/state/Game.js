import Phaser from 'phaser';
import Player from './../sprite/Player';
import BadGuy from './../sprite/BadGuy';
import { socket } from '../../util';

export default class GameState extends Phaser.Scene{

  constructor ()
  {
    super({ key: 'GameState' });
  }

  addPlayer = player => {
    this.player.spawn(player);
  }

  addOtherPlayer = player => {
    const otherPlayer = new BadGuy(this, player.playerId, player.x, player.y, 'player');
    this.badGuys.add(otherPlayer.getInstance());
  }

  addCurrentPlayers = players => {
    Object.keys(players).forEach((playerId) => {
      if (playerId === socket.id) {
        this.addPlayer(players[playerId]);
      } else {
        this.addOtherPlayer(players[playerId]);
      }
    });
  }

  removePlayer = playerId =>  {
    this.badGuys.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
        return;
      }
    })
  }

  playerMoved = player => {
    this.badGuys.getChildren().forEach(function (otherPlayer) {
      if (player.playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(player.x, player.y);
        return;
      }
  });
}
fireBullet(facing) {
  //  To avoid them being allowed to fire too fast we set a time limit
  if (this.time.now > this.bulletTime) {
    //  Grab the first bullet we can from the pool
    const bullet = this.bullets;
    bullet.get(this.player.x, this.player.y);
    console.log(bullet);
    // bulletFire.play()
    // if (bullet) {
    //   //  And fire it
    //   bullet.reset(this.player.x, this.player.y);
    //   if (facing === 'left') {
    //     bullet.angle = -180;
    //     bullet.body.velocity.x = -this.bulletSpeed;
    //   }
    //   if (facing === 'right') {
    //     bullet.angle = 0;
    //     bullet.body.velocity.x = this.bulletSpeed;
    //   }
    //   Streamy.emit('bulletFire', { data: { bulletx: this.player.x, bullety: this.player.y, facing }, id: Streamy.id() });
      this.bulletTime = this.time.now + 320;
  //   }
  }
}
  preload() {
    this.load.image('goodPlatform', 'img/goodPlatform.png');
    this.load.image('badPlatform', 'img/flaming-death-cloud.png');
    this.load.image('player', 'img/player.png');
    this.load.audio('bulletFire', ['audio/bulletFire.mp3']);
    this.load.image('bullet', 'img/bullet.png');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.RKey = this.input.keyboard.addKey('R');
    this.bulletFire = this.sound.add('bulletFire');
    this.bulletFire.setLoop(true).play();
    this.bulletFire.stop();

    this.bulletTime = 0;
    this.player = new Player(this);
    this.badGuys = this.physics.add.staticGroup();

    this.bullets = this.physics.add.group({
      key: 'bullet',
      repeat: 7,
  });

  let children = this.bullets.getChildren();
  children.forEach((child) => {
      if (child instanceof Phaser.GameObjects.Sprite) {
        console.log(child)
          child.body.setVelocity(0, 100);
      }
  });
    // this.bullets.enableBody = true;
    // this.physics.add.overlap(bullets, objectsB, collideCallback, processCallback, callbackContext);

    socket.open();
    socket.on('newPlayer', this.addOtherPlayer);
    socket.on('disconnect', this.removePlayer);
    socket.on('playerMoved', this.playerMoved);
    socket.on('currentPlayers', this.addCurrentPlayers);

    const badPlatforms = this.physics.add.staticGroup();
    badPlatforms.create(265, 440, 'badPlatform');
    badPlatforms.create(1005, 130, 'badPlatform');
    badPlatforms.create(1005, 460, 'badPlatform');

    const goodPlatforms = this.physics.add.staticGroup();
    goodPlatforms.create(175, 295, 'goodPlatform');
    goodPlatforms.create(1005, 420, 'goodPlatform');
    goodPlatforms.create(1005, 170, 'goodPlatform');


    this.physics.add.collider(this.player.getInstance(), badPlatforms,  this.collisionHandlerPlayerBadPlatform);
    this.physics.add.collider(this.player.getInstance(), goodPlatforms);

    this.physics.add.collider(this.badGuys, goodPlatforms, this.collisionHandlerBadGuyBadPlatform);
    this.physics.add.collider(this.badGuys, badPlatforms,  this.collisionHandlerBadGuyBadPlatform);
  }

  update() {

        //  Firing?
    if (this.cursors.space.isDown && this.player.alive) {
      this.fireBullet(this.player.facing);
    }

    if (this.cursors.left.isDown)
    {
        this.player.move('left');
        socket.emit("playerMovement",{ x: this.player.getInstance().x, y: this.player.getInstance().y })
    }
    else if (this.cursors.right.isDown)
    {
        this.player.move('right');
        socket.emit("playerMovement", { x: this.player.getInstance().x, y: this.player.getInstance().y })
    }
    else
    {
        this.player.move('stop');
        socket.emit("playerMovement", { x: this.player.getInstance().x, y: this.player.getInstance().y })
    }
    if (this.cursors.up.isDown)
    {
        this.player.move('up');
        socket.emit("playerMovement", { x: this.player.getInstance().x, y: this.player.getInstance().y })
    }

    if(this.RKey.isDown){
      this.player.spawn(500, 500);
    }
  }

  collisionHandlerPlayerBadPlatform = (player, badPlatform) => {
    // socket.emit('DJDie', { data: { id: socket.id() }, myID: socket.id() });
    this.player.die();
  }

  collisionHandlerBadGuyBadPlatform = (badGuy, badPlatform) => {
    // socket.emit('DJDie', { data: { id: socket.id() }, myID: socket.id() });
    // badGuy.destroy();
  }

  

  render() {
  }
}

