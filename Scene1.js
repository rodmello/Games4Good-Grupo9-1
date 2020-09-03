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
    this.myText = this.addText(80, 150, "Começar", 0x000000);
    this.myText.depth = 1;
    this.myText.setOrigin(0.5, 0.5);
    this.myButton = this.add.rectangle(80, 150, 100, 50, 0x00FF00);
    this.enableClick(this.myButton); 
  
  }

  update() {
    if (this.myButton.wasClicked ()) {
      this.scene.start ("Scene2");
      
    }
      

  }

  
}