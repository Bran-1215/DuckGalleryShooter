"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 800,         // 10 tiles, each 16 pixels, scaled 4x
    height: 600,
    scene: [GalleryShooter],
    fps: { forceSetTimeOut: true, target: 30 }
}

const game = new Phaser.Game(config);