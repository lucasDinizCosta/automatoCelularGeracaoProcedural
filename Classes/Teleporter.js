function Teleporter(type){
  this.proximoTeleporte = null;
  this.portal = new Sprite(32, type);
  this.roomNumber = -1;
}
//Teleporter.prototype = new Teleporter();
Teleporter.prototype.constructor = Teleporter;

/**
 * GX => Coluna;
 * GY => Linha
 */

/**
 * Retorna a referencia pra celula diretamente no mapa
 */
Teleporter.prototype.getCell = function(){
  return this.portal.map.cell[this.portal.gy][this.portal.gx];
}

Teleporter.prototype.setPosition = function(linha, coluna){
   this.portal.x = coluna * this.portal.s + this.portal.s/2;
   this.portal.y = linha * this.portal.s  + this.portal.s/2;
}

Teleporter.prototype.setPosition = function(celula){
  this.portal.x = celula.coluna * this.portal.s + this.portal.s/2;
  this.portal.y = celula.linha * this.portal.s  + this.portal.s/2;
}

Teleporter.prototype.copy = function(teleporter){
  this.proximoTeleporte = teleporter.proximoTeleporte;
  this.roomNumber = teleporter.roomNumber;
  this.portal.copy(teleporter.portal);
}

Teleporter.prototype.teleportar = function(player){
  if(this.proximoTeleporte !== null){
    audioLibrary.play("teleporte");
    player.sprite.x = this.proximoTeleporte.portal.x;
    player.sprite.y = this.proximoTeleporte.portal.y;
  }
  else{
    console.log("prximoTeleporte eh null !!!");
  }
}
