var ground = [];
var stonesxy = [];
var player;
var pole;
var cursor;
var explosion = false;

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

function div(val, by){
	return (val - val % by) / by;
}


function hitMeteor(player, explode){
	//console.log('Взрыв');
}

class gamescene extends Phaser.Scene
{	
	constructor()
	{
		super({ key: 'gamescene', active: false});
		this.player, this.bistones, this.meteor, this.explode, this.coin, this.scoreText, this.cursors, this.mx, this.my;
		this.ground = []; this.stonesxy = []; this.zxc, this.score = 0; this.explosion = false;
	}
	preload()
	{
		this.load.image('pole','gameobjects/mars800x600.jpg');
		this.load.image('rover','gameobjects/roverv3.png');
		this.load.image('stone', 'gameobjects/bigstone.png');
		this.load.spritesheet('meteor', 'gameobjects/meteorsheetv2.png', {frameWidth: 128, frameHeight: 128});
		this.load.spritesheet('coin', 'gameobjects/coinsheet.png', {frameWidth: 57.5, frameHeight: 82.25});
		this.load.spritesheet('explode', 'gameobjects/explosion.png', {frameWidth: 96, frameHeight: 96});
		this.load.spritesheet('buttonpause', 'gameobjects/buttonpause.png', {frameWidth:300, frameHeight: 110});
	}

	create()
	{
		this.score = 0;
		this.add.image(400,300, 'pole');

		this.player = this.physics.add.image(Phaser.Math.Between(100,700),Phaser.Math.Between(100,500),'rover');
		this.player.setBounce(0);
		this.player.setCollideWorldBounds(true);

		this.bigstones = this.physics.add.staticGroup();
		for (this.ifs=0; this.ifs<Phaser.Math.Between(0,6);this.ifs++){
			this.stonesxy[this.ifs*2] = Phaser.Math.Between(100,700);
			this.stonesxy[this.ifs*2+1] = Phaser.Math.Between(100,500); 
			this.bigstones.create(this.stonesxy[this.ifs*2], this.stonesxy[this.ifs*2+1], 'stone');
		}

		this.meteor = this.physics.add.sprite(-100,-100,'meteor');
		this.explode = this.physics.add.sprite(-100,-100,'explode');
		this.coin = this.physics.add.sprite(Phaser.Math.Between(100,700), Phaser.Math.Between(100,500), 'coin');
		this.buttonpause = this.add.sprite(715,37.5,'buttonpause').setScale(0.5).setInteractive();
		//this.buttonresume = this.add.sprite()

		this.buttonpause.on('pointerdown', function(pointer){
			this.setFrame(1);
		});
		this.buttonpause.on('pointerup', function(pointer){
			this.setFrame(0);
		});
		
		this.anims.create({
			key:'meteor',
			frames: this.anims.generateFrameNumbers('meteor', {start: 0, end: 26}),
			duration:1500,
		});

		this.anims.create({
			key:'explode',
			frames: this.anims.generateFrameNumbers('explode', {start:0, end: 51}),
			duration: 2000,
		});
		
		this.anims.create({
			key:'coin',
			frames: this.anims.generateFrameNumbers('coin'),
			framerate:10,
			repeat: -1
		});


		this.physics.add.overlap(this.player, this.coin, this.collectcoin, null, this);
		this.physics.add.collider(this.player, this.bigstones);
		this.physics.add.overlap(this.player, this.meteor, this.hitMeteor, null, this);
		this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update()
	{
		if(this.cursors.down.isDown && this.cursors.left.isDown){
			this.player.setVelocityX(-113);
			this.player.setVelocityY(113);
			this.player.setAngle(-135);

		}
		else if(this.cursors.down.isDown && this.cursors.right.isDown){
			this.player.setVelocityX(113);
			this.player.setVelocityY(113);
			this.player.setAngle(135);
		}
		else if(this.cursors.up.isDown && this.cursors.left.isDown){
			this.player.setVelocityX(-113);
			this.player.setVelocityY(-113);
			this.player.setAngle(-45);
		}
		else if(this.cursors.up.isDown && this.cursors.right.isDown){
			this.player.setVelocityX(113);
			this.player.setVelocityY(-113);
			this.player.setAngle(45);
		}
		else if (this.cursors.left.isDown)
		{
			this.player.setVelocityY(0);
			this.player.setVelocityX(-160);
			this.player.setAngle(-90);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityY(0);
			this.player.setVelocityX(160);
			this.player.setAngle(90);
		}
		else if (this.cursors.up.isDown)
		{
			this.player.setVelocityX(0);
			this.player.setVelocityY(-160);
			this.player.setAngle(0);
		}
		else if (this.cursors.down.isDown)
		{
			this.player.setVelocityX(0);
			this.player.setVelocityY(160);
			this.player.setAngle(180);
		}
		else
		{
			this.player.setVelocityX(0);
			this.player.setVelocityY(0);
		}
		if (Phaser.Math.Between(0,500) < 50){
			this.createMeteor();
		}

		if (true){
			this.coin.anims.play('coin', true);
		}
		if (this.buttonpause.frame.name == 0 && this.checkbuttonpause == 1){
			this.scene.pause();
			this.scene.launch('pause');
		}
		this.checkbuttonpause = this.buttonpause.frame.name;
		/*
		try{
			if (this.meteor.anims.currentFrame.index == 26){
				this.playerx = this.player.body.position.x;
				this.playery = this.player.body.position.y;
				if ((this.playerx > this.mx - 88 && this.playerx < this.mx + 88) && (this.playery > this.my - 88 && this.playery < this.my + 88)){
					this.scene.pause();
					this.scene.start('gameover', this.score);
				}
			}
		}
		catch(e){}
		*/
	}
	collectcoin(player, coin)
	{
		this.score++;
		this.newcoin = true;
		this.scoreText.setText('Score: ' + this.score);
		while(this.newcoin == true){
			this.newx = Phaser.Math.Between(50,750)
			this.newy = Phaser.Math.Between(50,550);
			for (var i=0;i<this.ifs;i++){
				if ((this.newx>this.stonesxy[i*2]+78.75 || this.newx < this.stonesxy[i*2]-78.75) && (this.newy>this.stonesxy[i*2+1]+84.75 || this.newy<this.stonesxy[i*2+1]-84.75))
				{
				}
				else
				{
					this.zxc++;
				}
			}
			if (this.zxc == 0){
				this.newcoin = false;
				this.coin.x = this.newx;
				this.coin.y = this.newy;
			}
			this.zxc = 0;
		}
	}

	createMeteor()
	{
		if (!this.explode.anims.isPlaying && !this.meteor.anims.isPlaying){
			this.mx = Phaser.Math.Between(50,750);
			this.my = Phaser.Math.Between(50,550);
			this.meteor.x = this.mx;
			this.meteor.y = this.my;
			this.explode.x = this.mx;
			this.explode.y = this.my;
			this.meteor.anims.play('meteor', true);
			this.explode.anims.play('explode', true);
		}
	}
	hitMeteor(player, meteor)
	{
		if (this.meteor.anims.currentFrame.index == 26){
			this.scene.pause();
			this.scene.start('gameover', this.score);
		}
	}
};

class menu extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'menu', active: true });
		this.pointer, this.startbutton; this.checkbutton = 0;
	}
	preload()
	{	
		this.load.spritesheet('buttonstart', 'gameobjects/buttonstart.png', {frameWidth:300, frameHeight:110});
		this.load.image('mainmenu','gameobjects/mainscene800x600.jpg');
	}
	create()
	{
		this.physics.add.image(400,300,'mainmenu');
		this.startbutton = this.add.sprite(400,450,'buttonstart').setInteractive();

		this.startbutton.on('pointerdown', function(pointer){
			this.setFrame(1);
		});
		this.startbutton.on('pointerup', function(pointer){
			this.setFrame(0);
		});
	}
	update()
	{	
		if (this.startbutton.frame.name == 0 && this.checkbutton == 1){
			this.scene.pause();
			this.scene.start('gamescene');
		}
		this.checkbutton = this.startbutton.frame.name;
	}
};

class gameover extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'gameover', active: false });
		this.pointer; this.scoreText;this.checkbuttonmenu = 0; this.checkbuttonrestart = 0;
	}
	preload()
	{
		this.load.image('gameover', 'gameobjects/gameover.png');
		this.load.spritesheet('buttonrestart', 'gameobjects/buttonrestart.png', {frameWidth:300, frameHeight:110});
		this.load.spritesheet('buttonmenu', 'gameobjects/buttonmenu.png', {frameWidth:300, frameHeight:110});
	}
	create(data)
	{
		if(typeof(data) != typeof(1)){data = 0;}
		this.gaveover = this.physics.add.image(400, 300, 'gameover');
		this.buttonrestart = this.physics.add.sprite(250, 500, 'buttonrestart').setInteractive();
		this.buttonmenu = this.physics.add.sprite(550, 500, 'buttonmenu').setInteractive();

		this.buttonrestart.on('pointerdown', function(pointer){
			this.setFrame(1);
		});
		this.buttonrestart.on('pointerup', function(pointer){
			this.setFrame(0);
		});

		this.buttonmenu.on('pointerdown', function(pointer){
			this.setFrame(1);
		});
		this.buttonmenu.on('pointerup', function(pointer){
			this.setFrame(0);
		});

		this.scoreText = this.add.text(400, 400, 'Score: ' + data, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 0.5);
	}
	update()
	{
		if (this.buttonrestart.frame.name == 0 && this.checkbuttonrestart == 1){
			this.scene.pause();
			this.scene.start('gamescene');
		}
		if (this.buttonmenu.frame.name == 0 && this.checkbuttonmenu == 1){
			this.scene.pause();
			this.scene.start('menu');
		}
		this.checkbuttonmenu = this.buttonmenu.frame.name;
		this.checkbuttonrestart = this.buttonrestart.frame.name;
	}
};
class pause extends Phaser.Scene
{
	constructor()
	{
		super({ key: 'pause', active: false });

	}
	preload()
	{
		this.load.image('pause', 'gameobjects/pause.png');
		this.load.image('black', 'gameobjects/black.png');
		this.load.spritesheet('buttonresume', 'gameobjects/buttonresume.png', {frameWidth:300, frameHeight:110});
	}
	create()
	{
		this.black = this.physics.add.image(400,300, 'black').setAlpha(0.5);
		this.pausefon = this.physics.add.image(400, 300, 'pause');
		this.buttonresume = this.physics.add.sprite(400, 450, 'buttonresume').setScale(0.5).setInteractive();

		this.buttonresume.on('pointerdown', function(pointer){
			this.setFrame(1);
		});
		this.buttonresume.on('pointerup', function(pointer){
			this.setFrame(0);
		});
	}
	update()
	{
		if (this.buttonresume.frame.name == 0 && this.checkbuttonresume == 1){
			this.scene.pause();
			this.scene.setVisible(false, 'pause');
			this.scene.resume('gamescene');
		}
		this.checkbuttonresume = this.buttonresume.frame.name;
	}
}
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
	physics: {default: 'arcade'},
    scene: [menu, gamescene, gameover, pause]
};
let game = new Phaser.Game(config);