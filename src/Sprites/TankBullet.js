class TankBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        this.angle = -90;
        this.targetY = 0;
        return this;
    }

    update() {
        if (this.active) {
            this.rotation += 0.1
            this.x -= this.speed;
            if(this.y < this.targetY) {
                this.y += this.speed;
            }
            if(this.y > this.targetY) {
                this.y -= this.speed;
            }
            if (this.x <  -(this.displayWidth/2)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

    findTarget(y) {
        this.targetY = y;
    }

}