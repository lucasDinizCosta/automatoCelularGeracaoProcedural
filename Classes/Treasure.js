function Treasure(){
    Sprite.call(this, {s: 18, w: 17, h: 10, nomeImagem: "coin_gold"});     
    this.roomNumber = -1;
    this.animation = [];
    this.qtdAnimacoes = 8;
    this.speedAnimation = 1.5;  // 1.2
    this.matrizImagem = {
        linhas: 1,
        colunas: 8,
        widthImagem: 32,
        heightImagem: 32
    }
    this.criarAnimacoes();
}
  
// Heranca
Treasure.prototype = new Sprite();              // Define que o Player é um Sprite
Treasure.prototype.constructor = Treasure;

/*Treasure.prototype.desenhar = function(ctx){
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.linewidth = 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillRect(- this.s/2, - this.s/2, this.s, this.s);
    ctx.strokeRect(- this.s/2, - this.s/2, this.s, this.s);
    ctx.fillStyle = "white";
    ctx.fillRect(- this.s/6, - this.s/6, this.s/6, this.s/6);
    ctx.restore();
    if(debugMode == 1){
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        this.desenharCaixaColisao(ctx);
    }
}*/

Treasure.prototype.criarAnimacoes = function(){
    for(let i = 0; i < this.matrizImagem.linhas; i++){
        for(let j = 0; j < this.matrizImagem.colunas; j++){
            let animationFrame = {
                sizeImagem: this.s,
                pose: (i + j * this.matrizImagem.colunas),
                sx: this.matrizImagem.widthImagem * j,
                sy: this.matrizImagem.heightImagem * i,
            };
            this.animation.push(animationFrame);
        }
    }
}

Treasure.prototype.mover = function (dt) {
    this.pose = this.pose + this.speedAnimation * dt;
}

Treasure.prototype.desenhar = function(ctx){
  
  /*let elipse = {
    x: -this.sizeImagem/8 + 8,
    y: -this.sizeImagem/16 + 3,
    radiusX: this.sizeImagem/4 - 2,
    radiusY: this.sizeImagem/8 - 2,
    rotation: 0,
    startAngle: 0,
    endAngle: 2 * Math.PI,
    anticlockwise: false
  }*/
  ctx.linewidth = 1;
  ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
  ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
  ctx.save();
  ctx.translate(this.x, this.y);
  /*ctx.beginPath();
  ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle, 
    elipse.endAngle, elipse.anticlockwise); //ctx.ellipse(-this.s/2 + 7, -this.s/4 + 6, this.s - 2, this.s/2 - 2, 0, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();*/
  //ctx, key, sx, sy, w, h, dx, dy, dw, dh
  assetsMng.drawClip({ctx: ctx, key: this.nomeImagem, 
    sx: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sx,
    sy: this.animation[Math.floor(this.pose) % this.qtdAnimacoes].sy,
    w: this.matrizImagem.widthImagem, h: this.matrizImagem.heightImagem, dx: -this.matrizImagem.widthImagem/2,  
    dy: -this.matrizImagem.heightImagem/2 - this.matrizImagem.heightImagem/2 + 3
  });
  ctx.restore();
  if(debugMode == 1){
    this.desenharCentro(ctx);
  }
  else if(debugMode == 2){
    this.desenharCaixaColisao(ctx);
  }
}

Treasure.prototype.copyWithAnimation = function(treasure){
    this.copy(treasure);
    for(let i = 0; i < treasure.animation.length; i++){
        let animationFrame = {
            sizeImagem: treasure.animation[i].sizeImagem,
            pose: treasure.animation[i].pose,
            sx: treasure.animation[i].sx,
            sy: treasure.animation[i].sy,
        };
        this.animation.push(animationFrame);
    }
    this.qtdAnimacoes = treasure.qtdAnimacoes;
    this.speedAnimation = treasure.speedAnimation;
    this.matrizImagem = {
        linhas: treasure.matrizImagem.linhas,
        colunas: treasure.matrizImagem.colunas,
        widthImagem: treasure.matrizImagem.widthImagem,
        heightImagem: treasure.matrizImagem.heightImagem
    }
}