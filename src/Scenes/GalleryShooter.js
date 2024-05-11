class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("GalleryShooter");
        this.my = { sprite: {}, text: {} };
        this.playMode = false;

        this.centerX = 400;
        this.centerY = 300;

        this.UpKey = null;
        this.DownKey = null;
        this.SpaceKey = null;
        this.myScore = 0;
        this.myLives = 1;

        this.playerSpeed = 8;
        this.bulletSpeed = 20;
        this.spawnCooldown = 50;
        this.spawnCooldownCounter = 0;
        this.spawnCooldownT = 100;
        this.spawnCooldownCounterT = 0;
        this.bulletCooldown = 3;
        this.bulletCooldownCounter = 0;
        this.gruntCounter = 0;
        this.gruntCounterKill = 0;
        this.gruntCounterMAX = 10;
        this.tankCounter = 0;
        this.tankCounterKill = 0;
        this.tankCounterMAX = 5;


        this.bulletDelay = 500;

    }


    preload() {
        this.load.setPath("./assets/");
        this.load.image("bgWater", "bg_blue.png");
        this.load.image("bgGrassTop", "bg_green_top.png");
        this.load.image("bgGrassBottom", "bg_green_bottom.png");

        this.load.image("duckPlayer", "duck_yellow.png");
        this.load.image("duckGrunt", "duck_white.png");
        this.load.image("duckTank", "duck_brown.png");

        this.load.image("bulletPlayer", "bulletPlayer.png");
        this.load.image("bulletGrunt", "bulletGrunt.png");
        this.load.image("bulletTank", "bulletTank.png");
        this.load.image("playButton", "green_button.png")
        this.load.image("retryButton", "grey_button.png")

        this.load.audio("bulletTank", "bulletTank.ogg");
        this.load.audio("bulletGrunt", "bulletGrunt.ogg");
        this.load.audio("bulletPlayer", "bulletPlayer.ogg");

        this.load.audio("hitTank", "hitTank.ogg");
        this.load.audio("hitGrunt", "hitGrunt.ogg");
        this.load.audio("hitPlayer", "hitPlayer.ogg");

        this.load.audio("killTank", "killTank.ogg");
        this.load.audio("waveComplete", "waveComplete.ogg");
        

    }


    create() {
        let my = this.my;

        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.SpaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // BACKGROUND
        my.sprite.bgWaterSprite = this.add.sprite(this.centerX, this.centerY, "bgWater");
        my.sprite.bgWaterSprite.scale = 3.3;
        my.sprite.bgGrassTopSprite = this.add.sprite(this.centerX, this.centerY - 625, "bgGrassTop");
        my.sprite.bgGrassTopSprite.scale = 3.3;
        my.sprite.bgGrassBottomSprite = this.add.sprite(this.centerX, this.centerY + 625, "bgGrassBottom");
        my.sprite.bgGrassBottomSprite.scale = 3.3;

        // PLAYER
        my.sprite.duckPlayerSprite = new Player(this, game.config.width - 750, game.config.height / 2, "duckPlayer", null, this.UpKey, this.DownKey, 8);
        my.sprite.duckPlayerSprite.setScale(0.5);
        my.sprite.duckPlayerSprite.visible = false;

        // PLAYER BULLET
        my.sprite.bulletPlayerGroup = this.add.group({
            active: true,
            defaultKey: "bulletPlayer",
            maxSize: 2,
            runChildUpdate: true
        }
        );
        my.sprite.bulletPlayerGroup.createMultiple({
            classType: PlayerBullet,
            active: false,
            key: my.sprite.bulletPlayerGroup.defaultKey,
            repeat: my.sprite.bulletPlayerGroup.maxSize - 1
        });
        my.sprite.bulletPlayerGroup.propertyValueSet("speed", this.bulletSpeed);

        // GRUNT DUCK
        this.gruntPoints = [
            702, 126, 644, 204, 698, 301, 762, 402, 706, 483, 634, 410, 698, 300, 765, 199, 699, 129
        ];
        this.gruntCurve = new Phaser.Curves.Spline(this.gruntPoints);
        my.sprite.gruntGroup = this.add.group({
            active: true,
            defaultKey: "duckGrunt",
            maxSize: 10,
            runChildUpdate: true
        });
        for (let i = 0; i < 10; i++) {
            let grunt = new Grunt(this, this.gruntCurve, this.gruntPoints[0], this.gruntPoints[1], "duckGrunt")
            grunt.active = false;
            grunt.visible = false;
            grunt.scale = 0.5;
            my.sprite.gruntGroup.add(grunt);
        }

        // GRUNT DUCK BULLET
        my.sprite.bulletGruntGroup = this.add.group({
            active: true,
            defaultKey: "bulletGrunt",
            maxSize: 10,
            runChildUpdate: true
        }
        );
        my.sprite.bulletGruntGroup.createMultiple({
            classType: GruntBullet,
            active: false,
            key: my.sprite.bulletGruntGroup.defaultKey,
            repeat: my.sprite.bulletGruntGroup.maxSize - 1
        });
        my.sprite.bulletGruntGroup.propertyValueSet("speed", this.bulletSpeed);

        // TANK DUCK
        this.tankPoints = [577, 470, 534, 126, 454, 459, 364, 124, 290, 454, 221, 127, 154, 474, 102, 130];
        this.tankCurve = new Phaser.Curves.Spline(this.tankPoints);
        my.sprite.tankGroup = this.add.group({
            active: true,
            defaultKey: "duckTank",
            maxSize: 5,
            runChildUpdate: true
        });
        for (let i = 0; i < 10; i++) {
            let tank = new Tank(this, this.tankCurve, this.tankPoints[0], this.tankPoints[1], "duckTank")
            tank.active = false;
            tank.visible = false;
            tank.scale = 0.5;
            my.sprite.tankGroup.add(tank);
        }

        // TANK DUCK BULLET
        my.sprite.bulletTankGroup = this.add.group({
            active: true,
            defaultKey: "bulletTank",
            maxSize: 1,
            runChildUpdate: true
        }
        );
        my.sprite.bulletTankGroup.createMultiple({
            classType: TankBullet,
            active: false,
            key: my.sprite.bulletTankGroup.defaultKey,
            repeat: my.sprite.bulletTankGroup.maxSize - 1
        });
        my.sprite.bulletTankGroup.propertyValueSet("speed", this.bulletSpeed - 4);

        
        my.text.score = this.add.text(580, 35, "Score:" + this.myScore, { fontSize: 36 })
        my.text.score.visible = false;

        my.text.lives = this.add.text(20, 35, "Lives:" + this.myLives, { fontSize: 36 });
        my.text.lives.visible = false;

        my.text.title = this.add.text(130, 100, "Duck Fight", { fontSize: 144, fontFamily: 'Brush Script MT, Brush Script Std, cursive', })

        my.sprite.playButton = this.add.sprite(this.centerX, this.centerY + 100, "playButton");

        my.text.playButtonText = this.add.text(355, 385, "Play", { fontSize: 36 })

        my.sprite.playButton.setInteractive();
        my.sprite.playButton.on('pointerdown', () => {
            this.initGame();
        });

        document.getElementById('description').innerHTML = '<h2>Duck Fight Gallery Shooter</h2><br>Up Arrow Key: Up // Down Arrow Key: Down // Space: fire/emit'

    }


    update() {
        let my = this.my;
        if (this.playMode) {
            if (this.myLives < 1) {
                this.playMode = false;
                this.endGame();
            }
            this.spawnCooldownCounter--;
            this.spawnCooldownCounterT--;
            this.bulletCooldownCounter--;
            my.sprite.duckPlayerSprite.update();

            if(this.gruntCounterKill == this.gruntCounterMAX && this.tankCounterKill == this.tankCounterMAX) {
                this.sound.play("waveComplete");
                this.gruntCounter = 0;
                this.gruntCounterKill = 0;
                this.gruntCounterMAX += 2;
                this.tankCounter = 0;
                this.tankCounterKill = 0;
                this.tankCounterMAX += 1;
                this.myLives += 1;
                this.updateLives();
            }

            // SHOOTING
            if (this.SpaceKey.isDown) {
                if (this.bulletCooldownCounter < 0) {
                    let bullet = my.sprite.bulletPlayerGroup.getFirstDead();
                    if (bullet != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        bullet.makeActive();
                        this.sound.play("bulletPlayer");
                        bullet.x = my.sprite.duckPlayerSprite.x + (my.sprite.duckPlayerSprite.displayWidth / 2);
                        bullet.y = my.sprite.duckPlayerSprite.y;
                    }
                }
            }

            // GRUNT SPAWNING
            if (this.spawnCooldownCounter < 0 && this.gruntCounter < this.gruntCounterMAX) {
                let grunt = my.sprite.gruntGroup.getFirstDead();
                if (grunt != null) {
                    this.spawnCooldownCounter = this.spawnCooldown;
                    this.gruntCounter++;
                    console.log("Grunt " + this.gruntCounter);
                    grunt.makeActive();
                }
            }

            // TANK SPAWNING
            if (this.spawnCooldownCounterT < 0 && this.tankCounter < this.tankCounterMAX) {
                let tank = my.sprite.tankGroup.getFirstDead();
                if (tank != null) {
                    this.spawnCooldownCounterT = this.spawnCooldownT;
                    this.tankCounter++;
                    console.log("Tank " +this.tankCounter);
                    tank.makeActive();
                }
            }

            // PLAYER BULLET AND GRUNT COLLISION
            my.sprite.bulletPlayerGroup.children.each(function (bullet) {
                my.sprite.gruntGroup.children.each(function (grunt) {
                    if (bullet && grunt && bullet.active && grunt.active) {
                        if (this.collides(bullet, grunt)) {
                            this.sound.play("hitGrunt");
                            bullet.x += 1000;
                            grunt.makeInactive();
                            this.myScore += 1;
                            this.gruntCounterKill++;
                            this.updateScore();
                        }
                    }
                }, this);
            }, this);

            // PLAYER BULLET AND TANK COLLISION
            my.sprite.bulletPlayerGroup.children.each(function (bullet) {
                my.sprite.tankGroup.children.each(function (tank) {
                    if (bullet && tank && bullet.active && tank.active) {
                        if (this.collides(bullet, tank)) {
                            this.sound.play("hitTank");
                            tank.tankHealth -= 1;
                            bullet.x += 1000;
                            if (tank.tankHealth <= 0) {
                                this.sound.play("killTank");
                                tank.makeInactive();
                                tank.tankHealth = 2;
                                this.myScore += 2;
                                this.tankCounterKill++;
                                this.updateScore();
                            }

                        }
                    }
                }, this);
            }, this);

            // GRUNT BULLET AND PLAYER COLLISION
            my.sprite.bulletGruntGroup.children.each(function (bullet) {
                if (bullet && bullet.active) {
                    if (this.collides(bullet, my.sprite.duckPlayerSprite)) {
                        bullet.x -= 1000;
                        this.sound.play("hitPlayer", {volume: 0.25});
                        this.myLives -= 1;
                        this.updateLives();
                    }
                }
            }, this);

            // TANK BULLET AND PLAYER COLLISION
            my.sprite.bulletTankGroup.children.each(function (bullet) {
                if (bullet && bullet.active) {
                    if (this.collides(bullet, my.sprite.duckPlayerSprite)) {
                        bullet.x -= 1000;
                        this.sound.play("hitPlayer", {volume: 0.5});
                        this.myLives -= 2;
                        this.updateLives();
                    }
                }
            }, this);

            // GRUNT SHOOTING
            let randomGrunt = Phaser.Math.RND.pick(my.sprite.gruntGroup.getChildren());
            this.time.delayedCall(this.bulletDelay, function () {
                if (randomGrunt && randomGrunt.active) {
                    let bullet = my.sprite.bulletGruntGroup.get(randomGrunt.x, randomGrunt.y);
                    if (bullet) {
                        this.sound.play("bulletGrunt");
                        bullet.makeActive();
                    }
                }
            }, [], this);

            // TANK SHOOTING
            let randomTank = Phaser.Math.RND.pick(my.sprite.tankGroup.getChildren());
            this.time.delayedCall(this.bulletDelay, function () {
                if (randomTank && randomTank.active) {
                    let bullet = my.sprite.bulletTankGroup.get(randomTank.x, randomTank.y);
                    if (bullet) {
                        this.sound.play("bulletTank");
                        bullet.findTarget(my.sprite.duckPlayerSprite.y);
                        bullet.makeActive();
                    }
                }
            }, [], this);

            this.bulletDelay += 250;


        }
    }


    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth / 2 + b.displayWidth / 2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight / 2 + b.displayHeight / 2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score:" + this.myScore);
    }
    updateLives() {
        let my = this.my;
        my.text.lives.setText("Lives:" + this.myLives);
    }

    initGame() {
        let my = this.my;
        this.gruntCounter = 0;
        this.gruntCounterKill = 0;
        this.gruntCounterMAX = 10;
        this.tankCounter = 0;
        this.tankCounterKill = 0;
        this.tankCounterMAX = 5;
        this.bulletDelay = 500;
        this.myLives = 10;
        this.myScore = 0;
        this.gruntCounter = 0;
        this.gruntCounterMAX = 10;
        this.updateLives();
        this.updateScore();
        my.sprite.duckPlayerSprite.flipY = false;
        my.sprite.tankGroup.children.each(function (tank) {
            if (tank.active) {
                tank.makeInactive();
            }
        }, this);
        my.sprite.bulletTankGroup.children.each(function (tank) {
            if (tank.active) {
                tank.makeInactive();
            }
        }, this);
        my.sprite.gruntGroup.children.each(function (grunt) {
            if (grunt.active) {
                grunt.makeInactive();
            }
        }, this);
        my.sprite.bulletGruntGroup.children.each(function (grunt) {
            if (grunt.active) {
                grunt.makeInactive();
            }
        }, this);
        my.sprite.playButton.visible = false;
        my.text.title.visible = false;
        my.text.playButtonText.visible = false;
        my.text.score.visible = true;
        my.text.lives.visible = true;
        my.sprite.duckPlayerSprite.visible = true;
        this.playMode = true;
    }

    endGame() {
        let my = this.my;
        this.my.sprite.duckPlayerSprite.flipY = true;
        this.my.text.score.visible = false;
        this.my.text.lives.visible = false;

        my.sprite.retryButton = this.add.sprite(this.centerX, this.centerY + 100, "retryButton");

        my.text.retryButtonText = this.add.text(350, 385, "Retry", { fontSize: 36, color: 'black' });

        my.text.title = this.add.text(220, 200, "Final Score:" + this.myScore, { fontSize: 72, fontFamily: 'Impact, fantasy', })

        my.sprite.retryButton.setInteractive();
        my.sprite.retryButton.on('pointerdown', () => {
            my.sprite.retryButton.visible = false;
            my.text.retryButtonText.visible = false;
            this.initGame();
        });

    }
}

/*
grunt death
tank death
tank hit

*/