function Teleporter(type){
  /**
   * Estabelece a relação de Herança entre Player e Sprite:
   *  -> Sprite é pai e player é filho
   */
  Sprite.call(this, {s: 32, w: 32, h: 32});     

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

Teleporter.prototype.copyTeleporte = function(teleporter, rooms){
  //this.proximoTeleporte = teleporter.proximoTeleporte;
  this.type = teleporter.type;
  this.roomNumber = teleporter.roomNumber;
  this.copy(teleporter);                              //Copia os dados do sprite
}

Teleporter.prototype.copyConnection = function(teleporter, rooms){
  // Copiando o proximo teleporte
  if(teleporter.proximoTeleporte != undefined){
    let aux = rooms[teleporter.proximoTeleporte.roomNumber - 1];
    if(this.type === 2){
      this.proximoTeleporte = aux.teleporterFinal;
    }
    else{
      this.proximoTeleporte = aux.teleporterInitial;
    }
    /*if(teleporter.proximoTeleporte.type === 2){     // inicio de sala
      this.proximoTeleporte = aux.teleporterInitial;
    }
    else{                                           // Final de sala
      this.proximoTeleporte = aux.teleporterFinal;
    }*/
  }
}

Teleporter.prototype.teleportar = function(player){
  if(this.proximoTeleporte != undefined){
    assetsMng.play("teleporte");
    player.x = this.proximoTeleporte.x;
    player.y = this.proximoTeleporte.y;
    player.gx = this.proximoTeleporte.gx;
    player.gy = this.proximoTeleporte.gy;
    player.room = this.proximoTeleporte.roomNumber;
    hud.bussola.update();
  }
  else{
    console.log("proximoTeleporte eh undefined !!!");
  }
}

Teleporter.prototype.desenhar = function(ctx){
  switch(this.type){
    case 0:                     // Início de fase
      {
        ctx.strokeStyle = "dark green";
        ctx.fillStyle = "green";
        ctx.linewidth = 10;
        ctx.save();
        ctx.globalAlpha = 0.40;         //Transparência
        ctx.translate(this.x, this.y);
        ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.restore();
      }
      break;
    case 1:                     // Final de fase
      {
        ctx.strokeStyle = "purple";
        ctx.fillStyle = "rgb(84, 98, 139)";
        ctx.linewidth = 10;
        ctx.save();
        ctx.globalAlpha = 0.60;         //Transparência
        ctx.translate(this.x, this.y);
        ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.restore(); 
      }
      break;
    case 2:                           // Teleporte Inicial room
      {
        ctx.strokeStyle = "darkblue";
        ctx.fillStyle = "blue";
        ctx.linewidth = 10;
        ctx.save(); 
        ctx.globalAlpha = 0.60;         //Transparência
        ctx.translate(this.x, this.y);
        ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.restore();
      }
      break;
    case 3:                         // Teleporte final room
      { 
        ctx.strokeStyle = "Yellow";
        ctx.fillStyle = "Orange";
        ctx.linewidth = 100;
        ctx.save();
        ctx.globalAlpha = 0.40;         //Transparência
        ctx.translate(this.x, this.y);
        ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
        ctx.restore();
      }
      break;
    default:
      console.log("Sprite type is wrong!!!");
      break;
  }                            
}
