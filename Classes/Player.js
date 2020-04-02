function Player(size, nomeImagem) {
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  Sprite.call(this, size);            

  this.timeWalkSound = 0.5;
  this.levelNumber = 1;
  this.vidas = 3;
  this.morre = true;

  //Mapa das teclas pressionadas
  this.up = false;
  this.down = false;
  this.right = false;
  this.left = false;
  this.ctrl = false;
  this.space = false;

  //AnimationStates
  this.sentidoMovimento = 0;          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
  this.atacando = 0;                  //0 => Não, 1 => Sim
  this.estadoAnimacaoAtual = 3;
  this.poseAtual = 0;
  this.animation = [];
  this.numAnimacoes = 8;

  this.criarAnimacoes();
  this.nomeImagem = nomeImagem;
}

//Player.prototype = new Player();

// Heranca
Player.prototype = new Sprite();              // Define que o Player é um Sprite
Player.prototype.constructor = Player;

Player.prototype.criarAnimacoes = function(){
  for(let i = 0; i < this.numAnimacoes; i++){
    this.animation.push(new Sprite());
  }
  this.animation[0].sizeImagem = 64;
  this.animation[0].pose = 8;
  this.animation[0].qtdAnimacoes = 8;
  this.animation[0].typeAnimation = 0;
  this.animation[1].sizeImagem = 64;
  this.animation[1].pose = 9;
  this.animation[1].qtdAnimacoes = 8;
  this.animation[1].typeAnimation = 0;

  this.animation[2].sizeImagem = 64;
  this.animation[2].pose = 10;
  this.animation[2].qtdAnimacoes = 8;
  this.animation[2].typeAnimation = 0;
  
  this.animation[3].sizeImagem = 64;
  this.animation[3].pose = 11;
  this.animation[3].qtdAnimacoes = 8;
  this.animation[3].typeAnimation = 0;

  // Ataques
  this.animation[4].sizeImagem = 64;
  this.animation[4].pose = 12;
  this.animation[4].qtdAnimacoes = 6;
  this.animation[4].typeAnimation = 1;
  this.animation[4].speedAnimation = 160;
  this.animation[5].sizeImagem = 64;
  this.animation[5].pose = 13;
  this.animation[5].qtdAnimacoes = 6;
  this.animation[5].typeAnimation = 1;
  this.animation[5].speedAnimation = 160;
  this.animation[6].sizeImagem = 64;
  this.animation[6].pose = 14;
  this.animation[6].qtdAnimacoes = 6;
  this.animation[6].typeAnimation = 1;
  this.animation[6].speedAnimation = 160;
  this.animation[7].sizeImagem = 64;
  this.animation[7].pose = 15;
  this.animation[7].qtdAnimacoes = 6;
  this.animation[7].typeAnimation = 1;
  this.animation[7].speedAnimation = 160;
}

Player.prototype.moverCompleto = function(dt){
  this.tratarAnimacao();
  this.mover(dt);
}

Player.prototype.tratarAnimacao = function(){
  switch (this.sentidoMovimento) {  //Movimento
    case 0:     //Direita
      this.estadoAnimacaoAtual = 3;
      break;
    case 1:     //Baixo
      this.estadoAnimacaoAtual = 2;
      break;
    case 2:     //Esquerda
      this.estadoAnimacaoAtual = 1;
      break;
    case 3:     //Cima
      this.estadoAnimacaoAtual = 0;
      break;
    default:
      break;
  }
  switch(this.atacando){
    case 0:
      break;
    case 1:
      //console.log("Atacando");
      this.estadoAnimacaoAtual = this.estadoAnimacaoAtual + 4;    
      break;
    default:
      break;
  }

  this.sizeImagem = this.animation[this.estadoAnimacaoAtual].sizeImagem;
  this.qtdAnimacoes = this.animation[this.estadoAnimacaoAtual].qtdAnimacoes;
  this.pose = this.animation[this.estadoAnimacaoAtual].pose;
  this.typeAnimation = this.animation[this.estadoAnimacaoAtual].typeAnimation;
  this.speedAnimation = this.animation[this.estadoAnimacaoAtual].speedAnimation;
  this.poseAtual = this.animation[this.estadoAnimacaoAtual].pose;
}

Player.prototype.desenhar = function(ctx){
  ctx.linewidth = 1;
  ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
  ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.beginPath();
  ctx.ellipse(-this.s/2 + 1, -this.s/4 + 2, this.s - 2, this.s/2 - 2, 0, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  //ctx, key, sx, sy, w, h, dx, dy, dw, dh
  assetsMng.drawClipSize({ctx: ctx, key: this.nomeImagem, 
    sx: (this.sizeImagem * (this.animationState % this.qtdAnimacoes)),
    sy: (this.sizeImagem * this.pose), w: this.sizeImagem, h: this.sizeImagem, 
    dx: (-6 - this.sizeImagem/2), dy: (4 - this.sizeImagem),  dw: this.sizeImagem, dh: this.sizeImagem
  });
  ctx.restore();
  if(debugMode == 1){
    this.desenharCell(ctx);         //Debug mode Grid
    this.desenharCentro(ctx);
  }
  else if(debugMode == 2){
    this.desenharCell(ctx);         //Debug mode Grid
    this.desenharCaixaColisao(ctx);
  }
}