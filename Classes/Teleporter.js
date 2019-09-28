function Teleporter(type){
  this.proximoTeleporte = null;
  this.portal = new Sprite(32, type);
}
//Teleporter.prototype = new Teleporter();
Teleporter.prototype.constructor = Teleporter;

/**
 * GX => Coluna;
 * GY => Linha
 */

 Teleporter.prototype.setPosition = function(linha, coluna){
   this.portal.x = coluna * this.portal.s;
   this.portal.y = linha * this.portal.s;
   this.portal.gx = coluna;
   this.portal.gy = linha;
 }

Teleporter.prototype.copy = function(teleporter){
  this.proximoTeleporte = teleporter.proximoTeleporte;
  this.portal.copy(teleporter.portal);
}

Teleporter.prototype.teleportar = function(player){
  //Executar um som
  player.sprite.x = this.portal.x;
  player.sprite.y = this.portal.y;
}
