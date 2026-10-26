/**
 * Phaser Game Configuration and Initialization
 */

window.addEventListener('load', () => {
    const config = {
        type: Phaser.AUTO,
        width: 960,
        height: 540,
        parent: 'game-container',
        pixelArt: true,
        roundPixels: true,
        backgroundColor: '#030712',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 1100 },
                debug: false
            }
        },
        scene: [BootScene, GameScene, VictoryScene]
    };

    window.game = new Phaser.Game(config);
});
