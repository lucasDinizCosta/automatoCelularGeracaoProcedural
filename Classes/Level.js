function Level(w,h,s) {
  this.mapa = new Map(w,h,s);
  this.salas = [];
  this.tesouros = 0;
  this.minas = 0;
  this.startX = 0;
  this.startY = 0;
  this.startGX = 0;
  this.startGY = 0;
  this.finishX = 0;
  this.finishY = 0;
  this.finishGX = 0;
  this.finishGY = 0;
  this.tempoFase = 0;
  this.taxaDiminuicaoTempo = 0;
  this.stateCollectedItens = false;
  this.inimigos = [];
  this.teleporteInicio;
  this.teleporteFinal;
  this.itens = [];
};

//Level.prototype = new Level();
Level.prototype.constructor = Level;

Level.prototype.setTempo = function(tempo, larguraBarra){
  this.tempoFase = tempo;
  this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
};

Level.prototype.setMatrixMap = function(matrix){
  this.mapa.copyDates(matrix);
};

Level.prototype.setMatrixMap2 = function(matrix, L,  C){
  this.mapa.copyDataInto(matrix, L, C);
};

Level.prototype.clonarLevel= function(level){
  this.mapa.w = level.mapa.w;
  this.mapa.h = level.mapa.h;
  this.mapa.s = level.mapa.s;
  for (var l = 0; l < level.mapa.h; l++) {
    for (var c = 0; c < level.mapa.w; c++) {
      this.mapa.cell[l][c] = level.mapa.cell[l][c];
    }
  }
  this.tesouros = level.tesouros;
  this.minas = level.minas;
  this.startX = level.startX;
  this.startY = level.startY;
  this.startGX = level.startGX;
  this.startGY = level.startGY;
  this.finishX = level.finishX;
  this.finishY = level.finishY;
  this.finishGX = level.finishGX;
  this.finishGY = level.finishGY;
  this.stateCollectedItens = level.stateCollectedItens;
  this.tempoFase = level.tempoFase;
  this.taxaDiminuicaoTempo = level.taxaDiminuicaoTempo;
  this.inimigos.length = 0;  
  this.itens.length = 0;
  for (var i = 0; i < level.inimigos.length; i++) {
    this.inimigos.push(level.inimigos[i]);
  }
  /*for (var i = 0; i < level.teleportes.length; i++) {
    this.teleportes.push(level.teleportes[i]);
  }*/
  for (var i = 0; i < level.itens.length; i++) {
    this.itens.push(level.itens[i]);
  }
  this.copiaSalas(level.salas);
  /*for (var i = 0; i < level.salas.length; i++) {
    this.salas.push(level.salas[i]);
  }*/
}

/*Level.prototype.toggleLevel = function(l){
  this = JSON.parse(JSON.stringify(l));  //Copia matriz

}*/

Level.prototype.copiaSalas = function(rooms){
  //this.salas = JSON.parse(JSON.stringify(rooms));  //Copia matriz
  for(let i = 0; i < rooms.length; i++){
     this.salas.push(new Room(0));
     this.salas[this.salas.length - 1].copy(rooms[i]);
  }

}

Level.prototype.desenhar = function(ctx) {
  this.mapa.desenhar(ctx);
  for(let i = 0; i < this.salas.length; i++){
    this.salas[i].draw(ctx);
  }
};
