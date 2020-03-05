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
  this.areaSafe = [];
  this.inimigos = [];
  this.teleporteInicioLevel = new Teleporter(3);         //(Inicio) mapa
  this.teleporteFinalLevel  = new Teleporter(4);        //(Final) mapa
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

Level.prototype.updateTempo = function(){
  this.tempoFase = this.tempoFase - 1;
  //this.larguraBarra = this.larguraBarra - this.taxaDiminuicaoTempo;
}

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
  this.teleporteInicioLevel.copy(level.teleporteInicioLevel);
  this.teleporteFinalLevel.copy(level.teleporteFinalLevel);
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
    let blocks = [];


    //Setting position of teleporters into the rooms

    for(let i = 0; i < this.rooms.length; i++){                 //Setting teleports into the room
        for(let j = 0; j < this.rooms[i].blocks.length; j++){
          let aux = [];
          aux.push(this.rooms[i].blocks[j][0]);
          aux.push(this.rooms[i].blocks[j][1]);
          blocks.push(aux);
        }
        sortPosition = this.getRandomInt(0 , (blocks.length - 1));
        this.rooms[i].teleporterInitial.setPosition(blocks[sortPosition][0], blocks[sortPosition][1]);
        blocks.splice(sortPosition, 1);
        sortPosition = this.getRandomInt(0 , (blocks.length - 1));
        this.rooms[i].teleporterFinal.setPosition(blocks[sortPosition][0], blocks[sortPosition][1]);
        this.rooms[i].teleporterInitial.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterFinal.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterInitial.portal.map = this.mapa;
        this.rooms[i].teleporterFinal.portal.map = this.mapa;
        roomsAvaliable.push(this.rooms[i].number);
        blocks = [];
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
        for(let i = 0; i < this.rooms.length; i++){
            if(roomsAvaliable[i] === currentRoom){                       //Room's number was found
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

    /*console.log("\nINITIAL\nA -> B:");
    for(let i = 0; i < this.rooms.length; i++){
        console.log("A( "+ this.rooms[i].teleporterInitial.roomNumber +" ) -> B( " + this.rooms[i].teleporterInitial.proximoTeleporte.roomNumber+ " )");
    }
    console.log("\nFINAL\nB -> A:");
    for(let i = 0; i < this.rooms.length; i++){
        console.log("B( "+ this.rooms[i].teleporterFinal.roomNumber +" ) -> A( " + this.rooms[i].teleporterFinal.proximoTeleporte.roomNumber  + " )");
    }*/
  }
  else{
    console.log("Level with only one room !!!");
  }
}

Level.prototype.atualizaGradeTeleportes = function(dt){
  for(let i = 0; i < this.rooms.length; i++){         //Atualiza o gx e gy dos teleportes
    this.rooms[i].teleporterInitial.portal.mover(dt);
    this.rooms[i].teleporterFinal.portal.mover(dt);
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
  while(((posicao[0] === this.rooms[0].teleporterInitial.portal.gy) && (posicao[1] === this.rooms[0].teleporterInitial.portal.gx))
  ||((posicao[0] === this.rooms[0].teleporterFinal.portal.gy) && (posicao[1] === this.rooms[0].teleporterFinal.portal.gx))){
    posicao = this.rooms[0].blocks[this.getRandomInt(0, this.rooms[0].blocks.length - 1)];
  }  
  this.teleporteInicioLevel.portal.gx = posicao[1];
  this.teleporteInicioLevel.portal.gy = posicao[0];
  this.teleporteInicioLevel.roomNumber = 1;
  this.teleporteInicioLevel.portal.x = this.mapa.s * this.teleporteInicioLevel.portal.gx + this.mapa.s/2;//p.sprite.s;
  this.teleporteInicioLevel.portal.y = this.mapa.s * this.teleporteInicioLevel.portal.gy + this.mapa.s/2;//p.sprite.s;
  
  this.startGX = posicao[1];
  this.startGY = posicao[0];
  this.startX = this.mapa.s * this.startGX + p.sprite.s;
  this.startY = this.mapa.s * this.startGY + p.sprite.s;

  let salaTeleporteFinal = this.getRandomInt(1, this.rooms.length - 1);
  posicao = this.rooms[salaTeleporteFinal].blocks[this.getRandomInt(0, this.rooms[salaTeleporteFinal].blocks.length - 1)];
  while(((posicao[0] === this.rooms[salaTeleporteFinal].teleporterInitial.portal.gy) && (posicao[1] === this.rooms[salaTeleporteFinal].teleporterInitial.portal.gx))
  ||((posicao[0] === this.rooms[salaTeleporteFinal].teleporterFinal.portal.gy) && (posicao[1] === this.rooms[salaTeleporteFinal].teleporterFinal.portal.gx))){
    posicao = this.rooms[0].blocks[this.getRandomInt(0, this.rooms[salaTeleporteFinal].blocks.length - 1)];
  }  
  this.teleporteFinalLevel.portal.gx = posicao[1];
  this.teleporteFinalLevel.portal.gy = posicao[0];
  this.teleporteFinalLevel.roomNumber = salaTeleporteFinal + 1;
  this.teleporteFinalLevel.portal.x = this.mapa.s * this.teleporteFinalLevel.portal.gx + this.mapa.s/2;//p.sprite.s;
  this.teleporteFinalLevel.portal.y = this.mapa.s * this.teleporteFinalLevel.portal.gy + this.mapa.s/2;//p.sprite.s;

  this.finishGX = posicao[1];
  this.finishGY = posicao[0];
  this.finishX = this.mapa.s * this.finishGX + p.sprite.s;
  this.finishY = this.mapa.s * this.finishGY + p.sprite.s;
}

/********************************
 * Calcula a matriz de distancias
 ********************************/

Level.prototype.atualizaMatrizDistancias = function(){
  this.mapa.atualizaDist(this.teleporteInicioLevel.portal.gy, this.teleporteInicioLevel.portal.gx, 0);
  for(let i = 1; i < this.rooms.length; i++){        //Começa a analisar a partir da próxima sala
    this.mapa.atualizaDist(this.rooms[i].teleporterInitial.portal.gy, this.rooms[i].teleporterInitial.portal.gx, 0);
  }
}

Level.prototype.posicionarAreasSafe = function(valor){
  //Posiciona na primeira distancia 35 e depois recalcula
  let terminouPosicionamento = false;
  let indiceSala = 0;
  while(terminouPosicionamento){
    let auxRoom = this.rooms[indiceSala];
    
    let celula = this.mapa.findCellByDistAndType(valor, 0, null, null);

    if(celula != null){

    }
    else{
      terminouPosicionamento = true;
    }
  }
}

/*Level.prototype.toggleLevel = function(l){
  this = JSON.parse(JSON.stringify(l));  //Copia matriz

}*/

Level.prototype.copiaSalas = function(rooms){
  this.rooms = [];
  for(let i = 0; i < rooms.length; i++){
     this.rooms.push(new Room(0));
     this.rooms[this.rooms.length - 1].copy(rooms[i]);
  }

}

Level.prototype.desenhar = function(ctx) {
  this.mapa.desenhar(ctx);
  this.teleporteInicioLevel.portal.desenhar(ctx);
  this.teleporteFinalLevel.portal.desenhar(ctx);
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].draw(ctx);
  }
};
