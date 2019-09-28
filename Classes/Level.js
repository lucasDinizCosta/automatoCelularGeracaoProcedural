function Level(w,h,s) {
  this.mapa = new Map(w,h,s);
  this.rooms = [];
  this.gradeSalas = [];
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
  for (var l = 0; l < h; l++) {
    this.gradeSalas[l] = [];
    for (var c = 0; c < w; c++) {
      this.gradeSalas[l][c] = -1;
    }
  }
};

/**
 * GX => Coluna;
 * GY => Linha
 */

//Level.prototype = new Level();
Level.prototype.constructor = Level;

Level.prototype.setTempo = function(tempo, larguraBarra){
  this.tempoFase = tempo;
  this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
};

Level.prototype.updateGradeSalas = function(){
  //this.gradeSalas = [];
  this.gradeSalas = this.mapa.geraGradeSalas();
  //console.log(this.gradeSalas);
}

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
  for (var l = 0; l < level.mapa.h; l++) {
    for (var c = 0; c < level.mapa.w; c++) {
      this.gradeSalas[l][c] = level.gradeSalas[l][c];
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
  this.copiaSalas(level.rooms);
  /*for (var i = 0; i < level.salas.length; i++) {
    this.salas.push(level.salas[i]);
  }*/
}

Level.prototype.getRandomInt = function(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Level.prototype.setTeleporters = function(){
  /*let roomChoices = [];
  for(let i = 0; i < this.rooms.length; i++){
      roomChoices.push(thisrooms[i].number);
  }*/
  let indAvaliableRoom;
  let indFinishRoom;
  let blocksSorted = [];
  blocksSorted.push(-1);              //Initial Teleporter
  blocksSorted.push(-1);              //Final teleporter
  let roomsAvaliable = [];            //Rooms avaliable to choose initial teleporter 
  let roomsClosed = [];               //Rooms that the initial teleporter is connected
  let sortPosition;

  for(let i = 0; i < this.rooms.length; i++){                 //Setting teleports into the room
      //Setting positions of the teleporters
      sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1));
      while(sortPosition === blocksSorted[0]){
          sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1));
      }
      //this.rooms[i].teleporterInitial.setStart(1, this.rooms[i].number, this.rooms[i].blocks[sortPosition][1], );
      this.rooms[i].teleporterInitial.setPosition(this.rooms[i].blocks[sortPosition][0], this.rooms[i].blocks[sortPosition][1]);
      blocksSorted[0] = sortPosition;
      sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1))
      while(sortPosition === blocksSorted[1]){
          sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1))
      }
      blocksSorted[1] = sortPosition;
      this.rooms[i].teleporterFinal.setPosition(this.rooms[i].blocks[sortPosition][0], this.rooms[i].blocks[sortPosition][1]);
      //this.rooms[i].teleporterFinal.setStart(2, this.rooms[i].number, this.rooms[i].blocks[sortPosition][1], this.rooms[i].blocks[sortPosition][0]);
      roomsAvaliable.push(this.rooms[i].number);
  }
  //GX => COLUNA, GY => LINHA

  //Connecting first rooms manually

  /*indAvaliableRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));                 //Begin teleporter room
  indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
  while(indAvaliableRoom  ===  indFinishRoom){
      indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
  }
  let currentRoom = this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
  
  this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.setFinish(this.rooms[roomsAvaliable[indFinishRoom] - 1].number, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGX, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGY);

  this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGY);

  roomsClosed.push(roomsAvaliable[indAvaliableRoom]);//roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
  roomsAvaliable.splice(indAvaliableRoom, 1);

  while(roomsAvaliable.length > 1){
      //currentRoom = this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
      //console.log(roomsAvaliable.length);
      for(let i = 0; i < this.rooms.length; i++){
          if(roomsAvaliable[i] === currentRoom){                       //Room's number was finded
              indAvaliableRoom = i;
              break;
          }
      }

      indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
      while(indAvaliableRoom  ===  indFinishRoom){
          //console.log(roomsAvaliable);
          //console.log(indAvaliableRoom + " avaliableRoom");
          //console.log(indFinishRoom + " finishRoom");
          indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
          //console.log("LOOP");
          if(roomsAvaliable.length === 2){
              if(indAvaliableRoom === 0){
                  indFinishRoom = 1;
              }
              else
                  indFinishRoom = 0;
          }
      }
      currentRoom = roomsAvaliable[indFinishRoom];//this.rooms[roomsAvaliable[indFinishRoom] - 1].number;

      this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.setFinish(this.rooms[roomsAvaliable[indFinishRoom] - 1].number, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGX, this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.startGY);
      
      this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.startGY);

      roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
      roomsAvaliable.splice(indAvaliableRoom, 1);
  }


  //Connecting last room => to create a cycle on the rooms connections

  this.rooms[roomsAvaliable[0] - 1].teleporterInitial.setFinish(this.rooms[roomsClosed[0] - 1].number, this.rooms[roomsClosed[0] - 1].teleporterFinal.startGX, this.rooms[roomsClosed[0] - 1].teleporterFinal.startGY);

  this.rooms[roomsClosed[0] - 1].teleporterFinal.setFinish(this.rooms[roomsAvaliable[0] - 1].number, this.rooms[roomsAvaliable[0] - 1].teleporterInitial.startGX, this.rooms[roomsAvaliable[0] - 1].teleporterInitial.startGY);

  roomsClosed.push(this.rooms[roomsAvaliable[0] - 1].number);
  roomsAvaliable.splice(indAvaliableRoom, 1);

  console.log("\nINITIAL\nA -> B:");
  for(let i = 0; i < this.rooms.length; i++){
      console.log("A( "+ this.rooms[i].teleporterInitial.startIDRoom +" ) -> B( " + this.rooms[i].teleporterInitial.finishIDRoom  + " )");
  }
  console.log("\nFINAL\nB -> A:");
  for(let i = 0; i < this.rooms.length; i++){
      console.log("B( "+ this.rooms[i].teleporterFinal.startIDRoom +" ) -> A( " + this.rooms[i].teleporterFinal.finishIDRoom  + " )");
  }*/
}

/*Level.prototype.toggleLevel = function(l){
  this = JSON.parse(JSON.stringify(l));  //Copia matriz

}*/

Level.prototype.copiaSalas = function(rooms){
  //this.salas = JSON.parse(JSON.stringify(rooms));  //Copia matriz
  for(let i = 0; i < rooms.length; i++){
     this.rooms.push(new Room(0));
     this.rooms[this.rooms.length - 1].copy(rooms[i]);
  }

}

Level.prototype.desenhar = function(ctx) {
  this.mapa.desenhar(ctx);
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].draw(ctx);
  }
};
