class Scene1 extends SimpleScene {
  constructor() {
    super("Scene1");
  }

  init() {

  }

  preload() {
    this.load.image("ZezinhoRun", "assets/ZezinhoRun.png");
    this.load.image("inicio", "assets/inicio.jpeg");

  }

  create() {
    //this.(250, 100, "Zezinho Run");
    this.add.image(0, 0, 'inicio').setScale(0.9).setOrigin(0, 0);
    this.add.image(150, 60, 'ZezinhoRun');
     
  }

  update() {

  }

  
}