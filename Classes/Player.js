function Player(size, nomeImagem) {
  this.sprite = new Sprite(size, 0);
  this.timeWalkSound = 0.5;
  this.levelNumber = 1;
  this.vidas = 3;

  //Mapa das teclas pressionadas
  this.up = false;
  this.down = false;
  this.right = false;
  this.left = false;
  this.ctrl = false;
  this.space = false;

  //AnimationStates
  this.sentidoMovimento = 0;          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
  this.estadoAnimacaoAtual = 3;
  this.poseAtual = 0;
  this.animation = [];
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation[0].sizeImagem = 64;
  this.animation[0].pose = 8;
  this.animation[0].qtdAnimacoes = 8;
  this.animation[1].sizeImagem = 64;
  this.animation[1].pose = 9;
  this.animation[1].qtdAnimacoes = 8;
  this.animation[2].sizeImagem = 64;
  this.animation[2].pose = 10;
  this.animation[2].qtdAnimacoes = 8;
  this.animation[3].sizeImagem = 64;
  this.animation[3].pose = 11;
  this.animation[3].qtdAnimacoes = 8;
  this.animation[4].sizeImagem = 64;
  this.animation[4].pose = 12;
  this.animation[4].qtdAnimacoes = 5;
  this.sprite.nomeImagem = nomeImagem;
}

Player.prototype.mover = function(dt){
  switch (this.sentidoMovimento) {
    case 0:
      this.estadoAnimacaoAtual = 3;
      break;
    case 1:
      this.estadoAnimacaoAtual = 2;
      break;
    case 2:
      this.estadoAnimacaoAtual = 1;
      break;
    case 3:
      this.estadoAnimacaoAtual = 0;
      break;
    default:
      break;
  }
  this.sprite.sizeImagem = this.animation[this.estadoAnimacaoAtual].sizeImagem;
  this.sprite.qtdAnimacoes = this.animation[this.estadoAnimacaoAtual].qtdAnimacoes;
  this.sprite.pose = this.animation[this.estadoAnimacaoAtual].pose;
  this.poseAtual = this.animation[this.estadoAnimacaoAtual].pose;
  this.sprite.mover(dt);
}


Player.prototype.desenhar = function(ctx){
  this.sprite.desenhar(ctx);
}