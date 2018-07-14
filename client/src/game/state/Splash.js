import Phaser from 'phaser';

export default class Splash extends Phaser.Scene {
    constructor() {
        super({ key: 'SplashState' });
    }

    init() {}

    preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }

    create() {
        this.add
            .text(400, 300, 'score: 0', { fontSize: '32px', fill: '#F00' })
            .setShadow(20, 20, 'rgba(0,255,0,0.5)', 20)
            .setOrigin(0.5, 0.5)
            .setText('This is a long long long string');

        this.input.once(
            'pointerup',
            function(event) {
                this.scene.start('BootState');
            },
            this
        );
    }

    update() {}
}
