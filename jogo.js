console.log("Jogo iniciado");

const hitSound = new Audio();
hitSound.src = "sounds/hit.wav";

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Background
const background = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.largura,
      background.altura,
      background.x,
      background.y,
      background.largura,
      background.altura
    );

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.largura,
      background.altura,
      background.x + background.largura,
      background.y,
      background.largura,
      background.altura
    );
  },
};

// Chão
const floor = {
  spriteX: 0,
  spriteY: 610,
  largura: 224,
  altura: 112,
  x: 0,
  y: canvas.height - 112,
  desenha() {
    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.largura,
      floor.altura,
      floor.x,
      floor.y,
      floor.largura,
      floor.altura
    );

    context.drawImage(
      sprites,
      floor.spriteX,
      floor.spriteY,
      floor.largura,
      floor.altura,
      floor.x + floor.largura,
      floor.y,
      floor.largura,
      floor.altura
    );
  },
};

function fazColisao(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const floorY = floor.y;

  if (flappyBirdY >= floorY) {
    return true;
  }
  return false;
}

function createFlappyBird() {
  // FlappyBird
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,
    pulo: 4.6,
    pula() {
      console.log("pulou");
      flappyBird.velocidade = -flappyBird.pulo;
    },
    atualiza() {
      if (fazColisao(flappyBird, floor)) {
        hitSound.play();
        mudaParaTela(Telas.INICIO);
        return;
      }
      flappyBird.velocidade += flappyBird.gravidade;
      flappyBird.y += flappyBird.velocidade;
    },
    desenha() {
      context.drawImage(
        sprites,
        flappyBird.spriteX,
        flappyBird.spriteY,
        flappyBird.largura,
        flappyBird.altura,
        flappyBird.x,
        flappyBird.y,
        flappyBird.largura,
        flappyBird.altura
      );
    },
  };
  return flappyBird;
}

// Mensagem Get Ready!
const messageGetReady = {
  spriteX: 134,
  spriteY: 0,
  largura: 174,
  altura: 152,
  x: (canvas.width - 174) / 2,
  y: 50,
  desenha() {
    context.drawImage(
      sprites,
      messageGetReady.spriteX,
      messageGetReady.spriteY,
      messageGetReady.largura,
      messageGetReady.altura,
      messageGetReady.x,
      messageGetReady.y,
      messageGetReady.largura,
      messageGetReady.altura
    );
  },
};

//
// [TELAS]
//
const globals = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa(){
      globals.flappyBird = createFlappyBird();
    },
    desenha() {
      background.desenha();
      floor.desenha();
      globals.flappyBird.desenha();
      messageGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {},
  },
};

Telas.JOGO = {
  desenha() {
    background.desenha();
    floor.desenha();
    globals.flappyBird.desenha();
  },
  click() {
    globals.flappyBird.pula();
  },
  atualiza() {
    globals.flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
