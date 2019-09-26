function Teleporter(){
  this.startGX = -1;
  this.startGY = -1;
  this.startIDRoom = -1;
  this.finishIDRoom = -1;
  this.finishGX = -1;
  this.finishGY = -1;
}

Teleporter.prototype.setStart = function(sIDRoom, bGX, bGY){
  this.startIDRoom = sIDRoom;
  this.startGX = bGX;
  this.startGY = bGY;
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
