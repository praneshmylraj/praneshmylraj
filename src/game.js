/**
 * Phaser Game Configuration and Initialization
 * Lo-Fi Relaxed Career Journey
 */

window.addEventListener('load', () => {
    const config = {
        type: Phaser.AUTO,
        width: 960,
        height: 540,
        parent: 'game-container',
        pixelArt: true,
        roundPixels: true,
        backgroundColor: '#09081e',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }, // Calm flat road, no gravity falling hazards
                debug: false
            }
        },
        scene: [BootScene, GameScene]
    };

    window.game = new Phaser.Game(config);
});
