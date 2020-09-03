  
let config = {
  type: Phaser.AUTO,
  width: 700,
  height: 400,
  backgroundColor: 0x000000,
  parent: "phaser-div",
  dom: {
    createContainer: true
  },
  scene: [Scene1, Scene2, Scene3, Scene4],
  
  physics: {
    default: 'arcade',
      arcade: {
        gravity: { y: 220 },
        debug: false,
        }
  }
};


var foundation_fonts = `Inconsolata, Cousine, Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`;

// cenario
var player;
var cursors;
var platforms;
var plataformPerso;
var plataformsTeto;
var visible;
// cesta
var scoreCestaText;
var cesta;
var score = 0

// bola
var scoreBolaText;
var bola;
var scoreBola = 0

//número
var tela3;
var scoreCestaTela3 = score
var scoreBolaTela3 = scoreBola

const game = new Phaser.Game(config);