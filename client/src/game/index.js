import Phaser from 'phaser';
import BootState from './state/Boot'
import SplashState from './state/Splash'
import GameState from './state/Game';

var config = {
    type: Phaser.AUTO,
    width: 1300,
    height: 600,
    parent: 'game',
    physics: {
        default: 'arcade',
        debug: true,
        arcade: {
            gravity: { y: 2000 }
        }
    },
    scene: [GameState, BootState, SplashState],
    backgroundColor: '#FFF'
};
const game = new Phaser.Game(config);

export default game;