class Grunt extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture, frame) {
        super(scene, path, x, y, texture, frame);
        this.flipX = true;
        this.startedFollow = false;
        this.pathStartX = 702;
        this.pathStartY = 126;
        scene.add.existing(this);
    }

    update() {
        if(this.active && !this.startedFollow) {
            this.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 10000,
                ease: 'Sine.easeOutQuad',
                repeat: -1,
                yoyo: false,
                rotateToPath: false,
                rotationOffset: -90
            });
            this.startedFollow = true;
        }
    }
    
    makeActive() {
        this.x = this.pathStartX;
        this.y = this.pathStartY;
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
        this.stopFollow();
        this.startedFollow = false;
    }
}

