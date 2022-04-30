console.log("Jogo iniciado");

let frames = 0;
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
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEm = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;

      chao.x = movimentacao % repeteEm;
    },
    desenha() {
      context.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x,
        chao.y,
        chao.largura,
        chao.altura
      );

      context.drawImage(
        sprites,
        chao.spriteX,
        chao.spriteY,
        chao.largura,
        chao.altura,
        chao.x + chao.largura,
        chao.y,
        chao.largura,
        chao.altura
      );
    },
  };
  return chao;
}

function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if (flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

function criaFlappyBird() {
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
      if (fazColisao(flappyBird, globais.chao)) {
        hitSound.play();
        mudaParaTela(Telas.INICIO);
        return;
      }
      flappyBird.velocidade += flappyBird.gravidade;
      flappyBird.y += flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0 }, // asa pra cima
      { spriteX: 0, spriteY: 26 }, // asa reta
      { spriteX: 0, spriteY: 52 }, // asa pra baixo
      { spriteX: 0, spriteY: 26 }, // asa reta
    ],
    frameAtual: 0,
    atualizaFrameAtual() {
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaFrameAtual();
      const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
      context.drawImage(
        sprites,
        spriteX,
        spriteY,
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

// Canos
function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaço: 80,
    desenha() {
      canos.pares.forEach(function (par) {
        const yRandom = par.y;
        const espacamentoEntreCanos = 90;
        const canoCeuX = par.x;
        const canoCeuY = yRandom;

        // Cano do Céu
        context.drawImage(
          sprites,
          canos.ceu.spriteX,
          canos.ceu.spriteY,
          canos.largura,
          canos.altura,
          canoCeuX,
          canoCeuY,
          canos.largura,
          canos.altura
        );
        // Cano do Chão
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
        context.drawImage(
          sprites,
          canos.chao.spriteX,
          canos.chao.spriteY,
          canos.largura,
          canos.altura,
          canoChaoX,
          canoChaoY,
          canos.largura,
          canos.altura
        );

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY,
        };
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY,
        };
      });
    },
    temColisaoComOFlappyBird(par) {
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if (globais.flappyBird.x >= par.x) {
        if (cabecaDoFlappy <= par.canoCeu.y) {

          return true;
        }

        if (peDoFlappy >= par.canoChao.y) {
          return true;
        }
      }

      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if (passou100Frames) {
        canos.pares.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function (par) {
        par.x -= 2;

        if (canos.temColisaoComOFlappyBird(par)) {
          hitSound.play();
          mudaParaTela(Telas.INICIO);
        }

        if (par.x + canos.largura <= 0) {
          canos.pares.shift();
        }
      });
    },
  };

  return canos;
}

//
// [TELAS]
//
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();
    },
    desenha() {
      background.desenha();
      globais.flappyBird.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      messageGetReady.desenha();
    },
    click() {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    },
  },
};

Telas.JOGO = {
  desenha() {
    background.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
  },
  click() {
    globais.flappyBird.pula();
  },
  atualiza() {
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames++;

  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();
