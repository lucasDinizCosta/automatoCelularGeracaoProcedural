function FireZone() {
    /**
     * Estabelece a relação de Herança entre Player e Sprite:
     *  -> Sprite é pai e player é filho
     */
    Sprite.call(this, 16);    

    this.qtdAnimacoes = 3;
    this.h = 24;
}

// Heranca
FireZone.prototype = new Sprite();                          // Define que o Player é um Sprite
FireZone.prototype.constructor = FireZone;

FireZone.prototype.desenhar = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "red";
    ctx.linewidth = 2;
    ctx.globalAlpha = 0.20;         //Transparência
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.s * 0.7, this.s * 0.7, 0, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1.00;         //Transparência
    assetsMng.drawClip(ctx, "flames", Math.floor(this.pose) * 16, 0, 16, 24, -8, -12, 16, 24);
    ctx.restore();
    if(debugMode == 1){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCaixaColisao(ctx);
    }
}

FireZone.prototype.mover = function (dt) {
    this.pose += 4 * dt;
    this.pose = this.pose > 4 ? 0 : this.pose;
    this.x = this.gx * this.map.s + this.s;             // Centraliza a firezone na celula
    this.y = this.gy * this.map.s + this.s;
}