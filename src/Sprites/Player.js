class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x, y, texture, frame, upKey, downKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.up = upKey;
        this.down = downKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);

        return this;
    }

    update() {
        if(this.up.isDown) {
            if(this.y > 120) {
                this.y -= 8;
                //console.log(my.sprite.duckPlayerSprite.y);
            }
            
        }

        if(this.down.isDown) {
            if(this.y < 480) {
                this.y += 8;
                //console.log(my.sprite.duckPlayerSprite.y);
            }
        }
    }

}