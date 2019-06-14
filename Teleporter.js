function teleporter(){
  this.startGX = 0;
  this.startGY = 0;
  this.finishGX = 0;
  this.finishGY = 0;
}

teleporter.prototype.teleportar = function(player){
  //Executar um som
  player.sprite.x = this.finishGX*levelAtual.mapa.s + player.sprite.s;
  player.sprite.y = this.finishGY*levelAtual.mapa.s + player.sprite.s;
  //console.log("FOI");
}
