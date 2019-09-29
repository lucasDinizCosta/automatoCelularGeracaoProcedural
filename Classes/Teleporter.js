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

 Teleporter.prototype.setPosition = function(linha, coluna){
   this.portal.x = coluna * this.portal.s + this.portal.s/2;
   this.portal.y = linha * this.portal.s  + this.portal.s/2;
 }

Teleporter.prototype.copy = function(teleporter){
  this.proximoTeleporte = teleporter.proximoTeleporte;
  this.portal.copy(teleporter.portal);
}

Teleporter.prototype.teleportar = function(player){
  if(this.proximoTeleporte !== null){
    player.sprite.x = this.proximoTeleporte.portal.x;
    player.sprite.y = this.proximoTeleporte.portal.y;
  }
  else{
    console.log("prximoTeleporte eh null !!!");
  }
}
