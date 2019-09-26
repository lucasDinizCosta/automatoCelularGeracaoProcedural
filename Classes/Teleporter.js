function Teleporter(type){
  this.startGX = -1;
  this.startGY = -1;
  this.startIDRoom = -1;
  this.finishIDRoom = -1;
  this.finishGX = -1;
  this.finishGY = -1;
  this.portal = new Sprite(32, 1);
}
//Teleporter.prototype = new Teleporter();
Teleporter.prototype.constructor = Teleporter;

Teleporter.prototype.setStart = function(type, sIDRoom, bGX, bGY){
  this.startIDRoom = sIDRoom;
  this.startGX = bGX;
  this.startGY = bGY;
  this.portal.gx = this.startGX;
  this.portal.gy = this.startGY;
  this.portal.typeSprite = type;
}

Teleporter.prototype.copy = function(teleporter){
  this.startGX = teleporter.startGX;
  this.startGY = teleporter.startGY;
  this.startIDRoom = teleporter.startIDRoom;
  this.finishIDRoom = teleporter.finishIDRoom;
  this.finishGX = teleporter.finishGX;
  this.finishGY = teleporter.finishGY;
  this.portal.copy(teleporter.portal);
}

Teleporter.prototype.setFinish = function(fIDRoom, fGX, fGY){
  this.finishGX = fGX;
  this.finishGY = fGY;
  this.finishIDRoom = fIDRoom;
}

Teleporter.prototype.teleportar = function(player){
  //Executar um som
  player.sprite.x = this.finishGX*levelAtual.mapa.s + player.sprite.s;
  player.sprite.y = this.finishGY*levelAtual.mapa.s + player.sprite.s;
  //console.log("FOI");
}
