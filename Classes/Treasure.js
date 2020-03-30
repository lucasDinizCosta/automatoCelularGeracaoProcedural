function Treasure(){
    Sprite.call(this, 8);     
    this.roomNumber = -1;
}
  
// Heranca
Treasure.prototype = new Sprite();              // Define que o Player é um Sprite
Treasure.prototype.constructor = Treasure;

Treasure.prototype.desenhar = function(ctx){
    //ctx.fillRect(this.x - this.s/2, this.y - this.s/2, this.s, this.s);
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
}