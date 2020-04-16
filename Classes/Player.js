function Player(params) {
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  Sprite.call(this, {s: params.size});            

  let exemplo = {
    timeWalkSound: 0.5,
    levelNumber: 1,
    vidas: 3,
    vivo: true,
    room: -1,

    // Mapa das teclas pressionadas
    up: false,
    down: false,
    right: false,
    left: false,
    ctrl: false,
    space: false,

    // AnimationStates
    sentidoMovimento: 0,          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
    atacando: 0,                  //0 => Não, 1 => Sim
    estadoAnimacaoAtual: 3,
    poseAtual: 0,
    animation: [],
    numAnimacoes: 8,
    nomeImagem: "player"
  }

  Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe

  this.w = params.size;
  this.h = params.size;

  this.criarAnimacoes();
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

Player.prototype.restart = function(){
  this.vivo = true;
  this.setRoom();
}

Player.prototype.setRoom = function(){
  this.room = this.map.cell[this.gy][this.gx].room;
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
  
  let elipse = {
    x: -this.sizeImagem/8 + 7,
    y: -this.sizeImagem/16 + 6,
    radiusX: this.sizeImagem/4 - 2,
    radiusY: this.sizeImagem/8 - 2,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    anticlockwise: false
  }
  ctx.linewidth = 1;
  ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
  ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.beginPath();
  ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle, 
    elipse.endAngle, elipse.anticlockwise); //ctx.ellipse(-this.s/2 + 7, -this.s/4 + 6, this.s - 2, this.s/2 - 2, 0, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  //ctx, key, sx, sy, w, h, dx, dy, dw, dh
  assetsMng.drawClipSize({ctx: ctx, key: this.nomeImagem, 
    sx: (this.sizeImagem * (this.animationState % this.qtdAnimacoes)),
    sy: (this.sizeImagem * this.pose), w: this.sizeImagem, h: this.sizeImagem, 
    dx: (- this.sizeImagem/2), dy: (8 - this.sizeImagem),  dw: this.sizeImagem, dh: this.sizeImagem
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

Player.prototype.mover = function (dt) {
  this.gx = Math.floor(this.x/this.map.s);
  this.gy = Math.floor(this.y/this.map.s);

  if(debugMode === 0 || debugMode === 2){
    if(this.gx === 0 || this.gx === (this.map.w - 1))  // Trata casos extremos do mapa =>{gx <= 0, gx >= gxMapa}
    {
      if(this.gx === 0){
        if(this.vx < 0){
          var limite = (this.gx) * this.map.s;
          var maxDx = limite - (this.x - this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1){
          var limite = (this.gx + 1) * this.map.s;
          var maxDx = limite-(this.x + this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx * dt;
        }
      }
      else{
        if(this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1){
          var limite = (this.gx) * this.map.s;
          var maxDx = limite - (this.x - this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0){
          var limite = (this.gx + 1) * this.map.s;
          var maxDx = limite - (this.x + this.w/2);
          var Dx = this.vx * dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx * dt;
        }
      }
    }
    else{
      if(this.vx < 0 && this.map.cell[this.gy][this.gx - 1].tipo === 1){
        var limite = (this.gx) * this.map.s;
        var maxDx = limite - (this.x - this.w/2);
        var Dx = this.vx * dt;
        this.x += Math.max(Dx, maxDx);
      } else if( this.vx > 0 && this.map.cell[this.gy][this.gx + 1].tipo === 1){
        var limite = (this.gx + 1) * this.map.s;
        var maxDx = limite - (this.x + this.w/2);
        var Dx = this.vx * dt;
        this.x += Math.min(Dx, maxDx);
      }else {
        this.x += this.vx * dt;
      }
    }

    if(this.gy === 0 || this.gy === (this.map.h - 1))  // Trata casos extremos do mapa =>{gy <= 0, gy >= gyMapa}
    {
      if(this.gy === 0){
        if(this.vy < 0){
          var limite = (this.gy) * this.map.s;
          var maxDy = limite - (this.y - this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0){
          var limite = (this.gy + 1) * this.map.s;
          var maxDy = limite - (this.y + this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy) * dt;
        }
      }
      else{
        if((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0){
          var limite = (this.gy) * this.map.s;
          var maxDy = limite - (this.y - this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) > 0){
          var limite = (this.gy + 1) * this.map.s;
          var maxDy = limite - (this.y + this.h/2);
          var Dy = (this.vy) * dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy) * dt;
        }
      }
    }
    else{
      if((this.vy) < 0 && this.map.cell[this.gy - 1][this.gx].tipo !== 0){
        var limite = (this.gy) * this.map.s;
        var maxDy = limite - (this.y - this.h/2);
        var Dy = (this.vy) * dt;
        this.y += Math.max(Dy, maxDy);
      } else if((this.vy) > 0 && this.map.cell[this.gy + 1][this.gx].tipo !== 0){
        var limite = (this.gy + 1) * this.map.s;
        var maxDy = limite - (this.y + this.h/2);
        var Dy = (this.vy) * dt;
        this.y += Math.min(Dy, maxDy);
      }else {
        this.y += (this.vy) * dt;
      }
    }
  }
  else{ //Debug mode => Colision is not detected
    this.x += (this.vx) * dt;
    this.y += (this.vy) * dt;
  }

  this.animationController();
};