define(['lodash'], function(_){
    var Story = function(mastersOfScrumApp, storyType, difficulty, x, y){

        this.mastersOfScrumApp = mastersOfScrumApp;

        this.difficulty = difficulty;

        //Graphicx
        this.sprite = mastersOfScrumApp.gameInstance.add.sprite(x,y,storyType.spritePath);
        this.sprite.animations.add('sparkle');

        //2D physics
        this.sprite.anchor.set(0.5);
        mastersOfScrumApp.gameInstance.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.immovable = true;
        this.sprite.body.collideWorldBounds = true;

        //Angle == rotation
        this.sprite.angle = 0;
    };

    Story.prototype = {
        update: function(){
            _.each(this.mastersOfScrumApp.board.players, function(player){
                this.mastersOfScrumApp.gameInstance.physics.arcade.collide(
                    this.sprite,
                    player.sprite,
                    this.playerStoryCollide,
                    null,
                    this);
            }, this);
        },
        playerStoryCollide: function(storySprite, playerSprite){
            //Set the player activeStory = this one
            var playerObj = _.find(this.mastersOfScrumApp.board.players, function(player){
                return player.sprite === playerSprite;
            });
            console.log('story collide!' + playerObj.playerSettings.name);
            //Move players already on card over
            var existingPlayers = _.filter(this.mastersOfScrumApp.board.players, function(player){
                return player.activeStory === this;
            }, this);
            _.each(existingPlayers, function(player){
                var tempTween = this.mastersOfScrumApp.gameInstance.add.tween(player.sprite);
                tempTween.to({x:this.sprite.x-64, angle:0}, 1000, Phaser.Easing.Bounce.Out);
                tempTween.start();
            }, this);
            //Tween player onto story card
            playerObj.activeStory = this;
            playerObj.isActive = false;
            playerObj.sprite.bringToTop();
            playerObj.avatarSprite.bringToTop();
            this.mastersOfScrumApp.playerTween = this.mastersOfScrumApp.gameInstance.add.tween(playerObj.sprite);
            this.mastersOfScrumApp.playerTween.to({x:this.sprite.x, y:this.sprite.y-10, angle:0}, 3000, Phaser.Easing.Bounce.Out);
            this.mastersOfScrumApp.playerTween.start();
        }
    };

    return Story;
});