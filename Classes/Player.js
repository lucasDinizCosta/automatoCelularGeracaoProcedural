function Player() {
  this.sprite = new Sprite();
  this.timeWalkSound = 0.5;
  this.levelNumber = 1;
  this.vidas = 3;

  //Mapa das teclas pressionadas
  this.up = false;
  this.down = false;
  this.right = false;
  this.left = false;
}

Player.prototype.mover = function(dt){
  this.sprite.mover(dt);
  this.timeWalkSound = this.timeWalkSound - dt;
  /*if((this.sprite.vx != 0 || this.sprite.vy != 0) && (this.timeWalkSound <= 0)){
    audioLibrary.play("sandWalk");
    this.timeWalkSound = 0.5;
  }*/

}

Player.prototype.desenhar = function(ctx){
  this.sprite.desenhar(ctx);
}
