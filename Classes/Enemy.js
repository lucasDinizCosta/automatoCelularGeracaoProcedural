function Enemy() {
    Sprite.call(this, 12);            
    this.roomNumber = -1;
    this.nomeImagem = "Enemy";
}

// Heranca
Enemy.prototype = new Sprite();              // Define que o Player é um Sprite
Enemy.prototype.constructor = Enemy;

Enemy.prototype.desenhar = function(ctx){
    ctx.fillStyle = "red";
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
}  