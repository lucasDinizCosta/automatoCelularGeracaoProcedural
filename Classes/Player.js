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
  this.sentidoMovimento = true;     //true - Esquerda-direita false - direitaEsquerda
  this.animationState = 0;
  this.tempoAnimacao = 1;
  this.estadoAnimacaoAtual = 0;
  this.sentidoAnimacao = true;      //true - crescente, false - descrescente
  this.poseAtual = 0;
  this.animation = [];
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation.push(new Sprite());
  this.animation[0].sx = 0;            //Parado
  this.animation[0].sy = 0;
  this.animation[0].sizeImagem = 64;
  this.animation[0].pose = 0;
  this.animation[0].qtdAnimacoes = 6;
  this.animation[1].sx = 0;            //Parado
  this.animation[1].sy = 64;
  this.animation[1].sizeImagem = 64;
  this.animation[1].pose = 1;
  this.animation[1].sx = 0;            //Parado
  this.animation[1].sy = 128;
  this.animation[1].sizeImagem = 64;
  this.animation[1].pose = 2;
  /*this.animation[0].sx = 0;            //Parado
  this.animation[0].sy = 704;
  this.animation[0].sizeImagem = 64;
  this.animation[0].pose = 0;*/

  this.sprite.nomeImagem = nomeImagem;
  this.sprite.sx = this.animation[this.estadoAnimacaoAtual].sx;
  this.sprite.sy = this.animation[this.estadoAnimacaoAtual].sy;
  this.sprite.sizeImagem = this.animation[this.estadoAnimacaoAtual].sizeImagem;
  this.poseAtual = this.animation[this.estadoAnimacaoAtual].pose;
}

Player.prototype.mover = function(dt){
  this.sprite.mover(dt);
  this.timeWalkSound = this.timeWalkSound - dt;
  /*if((this.sprite.vx != 0 || this.sprite.vy != 0) && (this.timeWalkSound <= 0)){
    audioLibrary.play("sandWalk");
    this.timeWalkSound = 0.5;
  }*/

}

Player.prototype.desenhar = function(ctx){
  //this.sprite.desenhar(ctx);
  this.sprite.desenhar(ctx);
}

Player.prototype.trocarAnimacaoCorrida = function () {
  if(this.tempoAnimacao <= 0){
    this.tempoAnimacao = 1;
    if(this.estadoAnimacaoAtual >= 0 && this.estadoAnimacaoAtual < 4){
      var proximoEstado;
      if(this.sentidoAnimacao){
        proximoEstado = this.estadoAnimacaoAtual + 1;
        if(proximoEstado > 3){
          this.sentidoAnimacao = false;                      //Inverte o sentido de animação
          this.estadoAnimacaoAtual = this.estadoAnimacaoAtual - 1;
        }
        else{
          this.estadoAnimacaoAtual = this.estadoAnimacaoAtual + 1;
        }
      }
      else{
        proximoEstado = this.estadoAnimacaoAtual - 1;
        if(proximoEstado < 1){
          this.sentidoAnimacao = true;                      //Inverte o sentido de animação
          this.estadoAnimacaoAtual = this.estadoAnimacaoAtual + 1;
        }
        else{
          this.estadoAnimacaoAtual = this.estadoAnimacaoAtual - 1;
        }
      }
    }
  }
  this.sprite.sx = this.animation[this.estadoAnimacaoAtual].sx;
  this.sprite.sy = this.animation[this.estadoAnimacaoAtual].sy;
  //this.tempoAnimacao = this.tempoAnimacao - 12*dt;
};
