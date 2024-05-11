class Tank extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture, frame) {
        super(scene, path, x, y, texture, frame);
        this.flipX = true;
        this.startedFollow = false;
        this.pathStartX = 577;
        this.pathStartY = 470;
        this.tankHealth = 2;
        scene.add.existing(this);
    }

    update() {
        if(this.active && !this.startedFollow) {
            this.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 50000,
                ease: 'Sine.easeOutQuad',
                repeat: -1,
                yoyo: true,
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

