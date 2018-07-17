import Phaser from 'phaser';
import Player from './../sprite/Player';
import BadGuy from './../sprite/BadGuy';
import { socket } from '../../util';

export default class GameState extends Phaser.Scene {
    constructor() {
        super({ key: 'GameState' });
    }

    addPlayer = player => {
        this.player.spawn(player);
    };

    addOtherPlayer = player => {
        const otherPlayer = new BadGuy(this, player.playerId, player.x, player.y, 'player');
        this.badGuys.add(otherPlayer.getInstance());
    };

    addCurrentPlayers = players => {
        Object.keys(players).forEach(playerId => {
            if (playerId === socket.id) {
                this.addPlayer(players[playerId]);
            } else {
                this.addOtherPlayer(players[playerId]);
            }
        });
    };

    removePlayer = playerId => {
        this.badGuys.getChildren().forEach(function(otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
                return;
            }
        });
    };

    playerMoved = player => {
        this.badGuys.getChildren().forEach(function(otherPlayer) {
            if (player.playerId === otherPlayer.playerId) {
                otherPlayer.setPosition(player.x, player.y);
                return;
            }
        });
    };
    fireBullet = facing => {
        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.time.now > this.bulletTime) {
            //  Grab the first bullet we can from the pool
            if (this.bullets.countActive(true) < this.bullets.maxSize) {
                const bullet = this.bullets.get(this.player.player.x, this.player.player.y);
                if (this.player.facing === 'right') {
                    bullet.setVelocity(1000, 0);
                } else if (this.player.facing === 'left') {
                    bullet.setVelocity(-1000, 0).setAngle(180);
                }
            }
            this.bulletTime = this.time.now + 320;
        }
    };
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
        this.badGuys = this.physics.add.group();
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 7,
            active: false,
            allowGravity: false
        });

        this.bulletBoundaryLeft = this.add.zone(-200, -20, 160, this.physics.world.bounds.height + 40);
        this.bulletBoundaryRight = this.add.zone(
            this.physics.world.bounds.width + 40,
            -20,
            160,
            this.physics.world.bounds.height + 40
        );
        this.bulletBoundaryLeft.body = new Phaser.Physics.Arcade.Body(this.physics.world, this.bulletBoundaryLeft);
        this.bulletBoundaryRight.body = new Phaser.Physics.Arcade.Body(this.physics.world, this.bulletBoundaryRight);

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

        this.physics.add.collider(this.player.getInstance(), badPlatforms, this.collisionHandlerPlayerBadPlatform);
        this.physics.add.collider(this.player.getInstance(), goodPlatforms);

        this.physics.add.collider(this.badGuys, goodPlatforms, this.collisionHandlerBadGuyBadPlatform);
        this.physics.add.collider(this.badGuys, badPlatforms, this.collisionHandlerBadGuyBadPlatform);

        this.physics.add.collider(this.bulletBoundaryLeft, this.bullets, this.collisionHandlerBulletBulletBoundary);
        this.physics.add.collider(this.bulletBoundaryRight, this.bullets, this.collisionHandlerBulletBulletBoundary);
    }

    update() {
        if (this.cursors.space.isDown && this.player.alive) {
            this.fireBullet();
        }

        if (this.cursors.left.isDown) {
            this.player.move('left');
            socket.emit('playerMovement', { x: this.player.getInstance().x, y: this.player.getInstance().y });
        } else if (this.cursors.right.isDown) {
            this.player.move('right');
            socket.emit('playerMovement', { x: this.player.getInstance().x, y: this.player.getInstance().y });
        } else {
            this.player.move('stop');
            socket.emit('playerMovement', { x: this.player.getInstance().x, y: this.player.getInstance().y });
        }
        if (this.cursors.up.isDown) {
            this.player.move('up');
            socket.emit('playerMovement', { x: this.player.getInstance().x, y: this.player.getInstance().y });
        }

        if (this.RKey.isDown) {
            this.player.spawn(500, 500);
        }
    }

    // Group vs Sprite collision the group element is always 2nd param
    collisionHandlerBulletBulletBoundary = (boundary, bullet) => {
        bullet.destroy();
    };
    collisionHandlerPlayerBadPlatform = (player, badPlatform) => {
        // socket.emit('DJDie', { data: { id: socket.id() }, myID: socket.id() });
        this.player.die();
    };

    collisionHandlerBadGuyBadPlatform = (badGuy, badPlatform) => {
        // socket.emit('DJDie', { data: { id: socket.id() }, myID: socket.id() });
        // badGuy.destroy();
    };

    render() {}
}
