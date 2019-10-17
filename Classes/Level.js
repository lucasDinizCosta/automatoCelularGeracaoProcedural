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
  this.gradeSalas = [];
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
  for (var i = 0; i < level.itens.length; i++) {
    this.itens.push(level.itens[i]);
  }
  this.copiaSalas(level.rooms);
}

Level.prototype.getRandomInt = function(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Level.prototype.setTeleporters = function(){
  if(this.rooms.length > 1){          //Only will have teleporters if that are more than one room
    let indAvaliableRoom;
    let indFinishRoom;
    let roomsAvaliable = [];            //Rooms avaliable to choose initial teleporter 
    let roomsClosed = [];               //Rooms that the initial teleporter is connected
    let sortPosition;
    let b = [];


    //Setting position of teleporters into the rooms

    for(let i = 0; i < this.rooms.length; i++){                 //Setting teleports into the room
        for(let j = 0; j < this.rooms[i].blocks.length; j++){
          let aux = [];
          aux.push(this.rooms[i].blocks[j][0]);
          aux.push(this.rooms[i].blocks[j][1]);
          b.push(aux);
        }
        sortPosition = this.getRandomInt(0 , (b.length - 1));
        this.rooms[i].teleporterInitial.setPosition(b[sortPosition][0], b[sortPosition][1]);
        b.splice(sortPosition, 1);
        sortPosition = this.getRandomInt(0 , (b.length - 1));
        this.rooms[i].teleporterFinal.setPosition(b[sortPosition][0], b[sortPosition][1]);
        this.rooms[i].teleporterInitial.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterFinal.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterInitial.portal.map = this.mapa;
        this.rooms[i].teleporterFinal.portal.map = this.mapa;
        roomsAvaliable.push(this.rooms[i].number);
        b = [];
    }
    //GX => COLUNA, GY => LINHA

    //Connecting first rooms manually

    indAvaliableRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));                 //Begin teleporter room
    indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
    while(indAvaliableRoom  ===  indFinishRoom){
        indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
    }
    let currentRoom = this.rooms[roomsAvaliable[indFinishRoom] - 1].number;
    
    this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.proximoTeleporte = this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal;
    this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.proximoTeleporte = this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial;

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
            indFinishRoom = this.getRandomInt(0 , (roomsAvaliable.length - 1));
            if(roomsAvaliable.length === 2){
                if(indAvaliableRoom === 0){
                    indFinishRoom = 1;
                    break;
                }
                else{
                  indFinishRoom = 0;
                  break;
                }
            }
        }
        currentRoom = roomsAvaliable[indFinishRoom];//this.rooms[roomsAvaliable[indFinishRoom] - 1].number;

        this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial.proximoTeleporte = this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal;
        this.rooms[roomsAvaliable[indFinishRoom] - 1].teleporterFinal.proximoTeleporte = this.rooms[roomsAvaliable[indAvaliableRoom] - 1].teleporterInitial;

        roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
        roomsAvaliable.splice(indAvaliableRoom, 1);
    }
    //Connecting last room => to create a cycle on the rooms connections

    this.rooms[roomsAvaliable[0] - 1].teleporterInitial.proximoTeleporte = this.rooms[roomsClosed[0] - 1].teleporterFinal;
    this.rooms[roomsClosed[0] - 1].teleporterFinal.proximoTeleporte = this.rooms[roomsAvaliable[0] - 1].teleporterInitial;

    roomsClosed.push(this.rooms[roomsAvaliable[0] - 1].number);
    roomsAvaliable.splice(indAvaliableRoom, 1);

    console.log("\nINITIAL\nA -> B:");
    for(let i = 0; i < this.rooms.length; i++){
        console.log("A( "+ this.rooms[i].teleporterInitial.roomNumber +" ) -> B( " + this.rooms[i].teleporterInitial.proximoTeleporte.roomNumber+ " )");
    }
    console.log("\nFINAL\nB -> A:");
    for(let i = 0; i < this.rooms.length; i++){
        console.log("B( "+ this.rooms[i].teleporterFinal.roomNumber +" ) -> A( " + this.rooms[i].teleporterFinal.proximoTeleporte.roomNumber  + " )");
    }
  }
  else{
    console.log("Level with only one room !!!");
  }
}

Level.prototype.dadosSalas = function(){
  for(let i = 0; i < this.rooms.length; i++){
    console.log("Sala " + this.rooms[i].number + " : ");
    console.log("teleporterInitial: ["+
      (this.rooms[i].teleporterInitial.portal.y - this.rooms[i].teleporterInitial.portal.s/2)/this.rooms[i].teleporterInitial.portal.map.s
      +"]"+"["+
      (this.rooms[i].teleporterInitial.portal.x - this.rooms[i].teleporterInitial.portal.s/2)/this.rooms[i].teleporterInitial.portal.map.s
      +"]");
    console.log("teleporterFinal: ["+
      (this.rooms[i].teleporterFinal.portal.y - this.rooms[i].teleporterFinal.portal.s/2)/this.rooms[i].teleporterFinal.portal.map.s
      +"]"+"["+
      (this.rooms[i].teleporterFinal.portal.x - this.rooms[i].teleporterFinal.portal.s/2)/this.rooms[i].teleporterFinal.portal.map.s
      +"]");
  }
}

Level.prototype.posicionarPlayer = function(p){
  //Blocos da sala 1 e posiciona o personagem
  let posicao = this.rooms[0].blocks[this.getRandomInt(0, this.rooms[0].blocks.length - 1)];
  this.startGX = posicao[1];
  this.startGY = posicao[0];
  this.startX = this.mapa.s * this.startGX + p.sprite.s;
  this.startY = this.mapa.s * this.startGY + p.sprite.s;
}

/*Level.prototype.toggleLevel = function(l){
  this = JSON.parse(JSON.stringify(l));  //Copia matriz

}*/

Level.prototype.copiaSalas = function(rooms){
  //this.rooms = JSON.parse(JSON.stringify(rooms));  //Copia matriz
  //console.log(rooms);
  this.rooms = [];
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
