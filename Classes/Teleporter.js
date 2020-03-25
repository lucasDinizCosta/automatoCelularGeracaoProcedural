function Teleporter(type){
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  Sprite.call(this, 32);     

  this.proximoTeleporte = undefined;
  this.type = type;
  this.roomNumber = -1;
}

// Heranca
Teleporter.prototype = new Sprite();              // Define que o Player é um Sprite
Teleporter.prototype.constructor = Teleporter;

/**
 * GX => Coluna;
 * GY => Linha
 */

/**
 * Retorna a referencia pra celula diretamente no mapa
 */

Teleporter.prototype.getCell = function(){
  return this.map.cell[this.gy][this.gx];
}

Teleporter.prototype.setPosition = function(linha, coluna){
   this.x = coluna * this.s + this.s/2;
   this.y = linha * this.s  + this.s/2;
}

Teleporter.prototype.setPosition = function(celula){
  this.x = celula.coluna * this.s + this.s/2;
  this.y = celula.linha * this.s  + this.s/2;
}

Teleporter.prototype.copyTeleporte = function(teleporter){
  this.proximoTeleporte = teleporter.proximoTeleporte;
  this.type = teleporter.type;
  this.roomNumber = teleporter.roomNumber;
  this.copy(teleporter);                              //Copia os dados do sprite
}

Teleporter.prototype.teleportar = function(player){
  if(this.proximoTeleporte !== null){
    assetMng.play("teleporte");
    player.x = this.proximoTeleporte.x;
    player.y = this.proximoTeleporte.y;
  }
  else{
    console.log("prximoTeleporte eh null !!!");
  }
}

Teleporter.prototype.desenhar = function(ctx){
  switch(this.type){
    case 0:                     // Início de fase
      ctx.save();
      ctx.strokeStyle = "dark green";
      ctx.fillStyle = "green";
      ctx.linewidth = 10;
      // assetsMng.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
      ctx.globalAlpha = 0.40;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
      break;
    case 1:                     // Final de fase
      ctx.save();
      ctx.fillStyle = "rgb(84, 98, 139)";
      ctx.strokeStyle = "purple";
      ctx.linewidth = 10;
      ctx.globalAlpha = 0.60;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
      break;
    case 2:                           // Teleporte Inicial room
      ctx.save();
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      ctx.linewidth = 10;
      ctx.globalAlpha = 0.40;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
    case 3:                         // Teleporte final room
      ctx.save();
      ctx.strokeStyle = "Yellow";
      ctx.fillStyle = "orange";
      ctx.linewidth = 10;
      // assetsMng.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
      ctx.globalAlpha = 0.40;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
      break;
  }                            
}
