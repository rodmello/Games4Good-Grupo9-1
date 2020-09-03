class Scene3 extends SimpleScene {
  constructor() {
    super("Scene3");
  }

  init() {

  }

  preload() {

    this.load.audio("som", "assets/sounds/tone1.ogg");
    this.load.image('plataformaBanco', "assets/plataformPers.png");
    this.load.image('ground', "assets/platform.png");
    this.load.image('bolaImg', "assets/bola.png");
    this.load.image("favelanoite", "assets/Favelanoite.jpeg");
    this.load.image("estrela", "assets/star.png");
    this.load.image("cestaAlimentos", "assets/CestaDeAlimentos.png");
    this.load.image("cestaColetar", "assets/CestaCollect.png");
    this.load.image('bolaColetar', "assets/BolaCollect.png");
   // this.load.image("boneco", "assets/dude.png");
      this.load.spritesheet('boneco','assets/dude.png',
      { frameWidth: 59.1, frameHeight: 50 }
    );
  }

  create() {

        //imagens para ilustração
    this.add.image(0, 0, 'favelanoite').setOrigin(0, 0);
    this.add.image(20, 20, 'cestaAlimentos').setScale(0.08);
    this.add.image(100, 22, 'bolaImg' ).setScale(0.08);

      //plataforma que para os objts (OBS: Nao pode interagir com "PLAYER")

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568).setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 400, 'ground');
    platforms.create(700, 220, 'ground');
    platforms.create(350, 400, 'ground');

    // plataforma do banco que interagi com o personagem

    //plataformPerso = this.physics.add.staticGroup();
    //plataformPerso.create(530, 360, 'plataformaBanco');
    //this.physics.add.collider (plataformPerso, player);



      //this.mySprite = this.add.sprite(20, 300, 'boneco');



     // personagem e suas interações

    player = this.physics.add.sprite(20, 200, 'boneco').setScale(1);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('boneco', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1, 
    } );
  
    this.anims.create({
    key: 'turn',
    frames: [ { key: 'boneco', frame: 4 } ],
    frameRate: 20,
    });
      
    this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('boneco', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  
  });

  // plataforma do banco que interagi com o personagem

   
    plataformPerso = this.physics.add.staticGroup();
    plataformPerso.create(530, 360, 'plataformaBanco').setScale(1).refreshBody();
    this.physics.add.collider (plataformPerso, player);

    plataformsTeto = this.physics.add.staticGroup();
    plataformsTeto.create(400, 220, 'ground') 
    plataformsTeto.create(300, 220, 'ground')
    plataformsTeto.create(500, 220, 'ground')

    this.physics.add.collider (plataformsTeto, player);

    //CESTA E COLETAR

    cesta = this.physics.add.group({
    key: 'cestaColetar',
    repeat: 2,
    setXY: { x: 120, y: 0, stepX: 300 }
  });

    cesta.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.0, 0.0));

  });
  
    scoreCestaText = this.add.text(31, 10, ':4', { fontSize: '32px', fill: '#FF0000' });
    function collectCesta (player, cesta)
  {
    cesta.disableBody(true, true);
    score += 2 ;
    scoreCestaText.setText(':' + score);
  
  }
    this.physics.add.collider(platforms, cesta);
    this.physics.add.overlap(player, cesta, collectCesta, null, this);


   // BOLA E COLETAR

    bola = this.physics.add.group({
    key: 'bolaColetar',
    repeat: 0,
    setXY: { x: 300, y: 0, stepX: 250 }
  });
    bola.children.iterate(function (child) {

    child.setBounceY(Phaser.Math.FloatBetween(0.0, 0.0));
    
    });

    scoreBolaText = this.add.text(120, 10, ':1', { fontSize: '32px', fill: '#FF0000' });
    function collectBola (player, bola)
    {
      bola.disableBody(true, true);
      scoreBola += 1;
      scoreBolaText.setText(':' + scoreBola);

    }
    this.physics.add.collider(platforms, bola);
    this.physics.add.overlap(player, bola, collectBola, null, this);

    this.myText = this.addText(600, 50, 'Next', 0x000000);
    this.myText.depth = 1;
    this.myText.setOrigin(0.5, 0.5);
    this.myText.visible = false;
    this.myButton = this.add.rectangle(600, 50, 100, 50, 0x0000FF);
    this.enableClick(this.myButton); 
    this.myButton.visible = false;
  }

  
  update() {
    if(score == 8 && scoreBola == 2)
    {
  
    this.myButton.visible= true;

    
    this.myText.visible= true;
    }

    cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown)
    {
    player.setVelocityX(-160);

    player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
    player.setVelocityX(160);

    player.anims.play('right', true);
    }
    
    else 
    {
      player.setVelocityX(0);
      player.anims.play('turn')
    }
    if (cursors.up.isDown)
    {
    player.setVelocityY(-200);
    }


if(this.myButton.wasClicked()){
     this.scene.start("Scene4");

  } 
} 
}