function Level(w, h, s) {
  this.mapa = new Map(w,h,s);
  this.rooms = [];
  this.tesouros = [];
  this.inimigos = [];
  this.tempoFase = 0;
  this.tempoTotal = 0;
  this.taxaDiminuicaoTempo = 0;
  this.stateCollectedItens = false;
  this.teleporteInicioLevel = new Teleporter(0);         //(Inicio) mapa
  this.teleporteFinalLevel  = new Teleporter(1);        //(Final) mapa
};

/**
 * GX => Coluna;
 * GY => Linha
 */

//Level.prototype = new Level();
Level.prototype.constructor = Level;

Level.prototype.setTempo = function(tempo, larguraBarra){
  this.tempoFase = tempo;
  this.tempoTotal = tempo;
  this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
};

Level.prototype.updateTempo = function(player){
  this.tempoFase = this.tempoFase - 1;
}

// Caminha na matriz e encontra as salas que cada célula pertence
Level.prototype.mapearSalas = function(){
  this.mapa.mapearSalas();
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
      this.mapa.cell[l][c].tipo = level.mapa.cell[l][c].tipo;
      this.mapa.cell[l][c].room = level.mapa.cell[l][c].room;
      this.mapa.cell[l][c].distTeleportes = level.mapa.cell[l][c].distTeleportes;
      this.mapa.cell[l][c].distFirezones = level.mapa.cell[l][c].distFirezones;
      this.mapa.cell[l][c].distInimigos = level.mapa.cell[l][c].distInimigos;
      this.mapa.cell[l][c].distTesouros = level.mapa.cell[l][c].distTesouros;
      this.mapa.cell[l][c].linha = level.mapa.cell[l][c].linha;
      this.mapa.cell[l][c].coluna = level.mapa.cell[l][c].coluna;
    }
  }
  this.tesouros = level.tesouros;
  this.stateCollectedItens = level.stateCollectedItens;
  this.tempoFase = level.tempoFase;
  this.tempoTotal = level.tempoTotal;
  this.taxaDiminuicaoTempo = level.taxaDiminuicaoTempo;
  this.teleporteInicioLevel.copyTeleporte(level.teleporteInicioLevel);
  this.teleporteFinalLevel.copyTeleporte(level.teleporteFinalLevel);
  this.inimigos.length = 0;  
  for (var i = 0; i < level.inimigos.length; i++) {
    this.inimigos.push(level.inimigos[i]);
  }
  this.copiaSalasComReferencia(level.rooms);
}

/**
 * Utiliza o gerador de seed como referencia pra escolha numerica
 */
Level.prototype.getRandomInt = function(min, max){
  return seedGen.getRandomIntMethod_1(min, max); 
}

/**
 * -> Atribui os teleportes dentro das salas e insere nos blocos A REFERENCIA PARA O MAPA
 * -> Posiciona de forma ALEATÓRIA sem seguir a lógica de distancia dos teleportes
 */

Level.prototype.setTeleporters = function(){
  if(this.rooms.length > 1){          //Only will have teleporters if there are more than one room
    let indAvaliableRoom;
    let indFinishRoom;
    let roomsAvaliable = [];            //Rooms avaliable to choose initial teleporter 
    let roomsClosed = [];               //Rooms that the initial teleporter is connected
    let sortPosition;
    let blocks = [];

    // Setting position of teleporters into the rooms

    for(let i = 0; i < this.rooms.length; i++){                 //Setting teleports into the room
        for(let j = 0; j < this.rooms[i].blocks.length; j++){
          let aux = this.rooms[i].blocks[j];          // Referencia para a celula do mapa
          blocks.push(aux);
        }
        sortPosition = this.getRandomInt(0 , (blocks.length - 1));
        this.rooms[i].teleporterInitial.setPosition(blocks[sortPosition]);
        blocks.splice(sortPosition, 1);
        sortPosition = this.getRandomInt(0 , (blocks.length - 1));
        this.rooms[i].teleporterFinal.setPosition(blocks[sortPosition]);
        this.rooms[i].teleporterInitial.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterFinal.roomNumber = this.rooms[i].number;
        this.rooms[i].teleporterInitial.map = this.mapa;
        this.rooms[i].teleporterFinal.map = this.mapa;
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

    roomsClosed.push(roomsAvaliable[indAvaliableRoom]);           //roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
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

/**
 * -> Atribui os teleportes dentro das salas e insere nos blocos A REFERENCIA PARA O MAPA
 * -> Posiciona de forma com base na DISTÂNCIA DOS TELEPORTES
 * 
 *  porcentagem: Intervalo de distância
 *  params:{porcentagem, opcaoTeleporteInicio, opcaoTeleporteFinal}
 */

Level.prototype.setTeleporters_2 = function(params){
  if(this.rooms.length > 1){          //Only will have teleporters if there are more than one room
    let indAvaliableRoom;
    let indFinishRoom;
    let roomsAvaliable = [];            //Rooms disponiveis para escolher o teleporte inicial
    let roomsClosed = [];               //Rooms que o teleporte inicial foi conectado
    let sortPosition;
    let blocks = [];


    // posicionando todos os teleportes de inicio de sala
    for(let i = 0; i < this.rooms.length; i++){            
      sortPosition = this.getRandomInt(0 , (this.rooms[i].blocks.length - 1));
      this.rooms[i].teleporterInitial.setPosition(this.rooms[i].blocks[sortPosition]);
      this.rooms[i].teleporterInitial.roomNumber = this.rooms[i].number;
      this.rooms[i].teleporterInitial.gy = this.rooms[i].blocks[sortPosition].linha;
      this.rooms[i].teleporterInitial.gx = this.rooms[i].blocks[sortPosition].coluna;
      this.rooms[i].teleporterInitial.map = this.mapa;
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 0);     // Atualiza distancia dos teleportes
      roomsAvaliable.push(this.rooms[i].number);                                                                // Vetor de salas disponíveis na hora realizar a ligação entre elas
    }

    // posicionando todos os teleportes de final de sala
    for(let i = 0; i < this.rooms.length; i++){
      let maxDist = this.rooms[i].getMaxDist(0);                       // Maxima distancia dos teleportes
      let criterio = Math.floor((params.porcentagem * maxDist)/100);   // Porcentagem da distancia maxima

      let listaCelulas = this.rooms[i].getCellsByDist(criterio, 0);    // Listagem de celulas dentro do criterio de escolha para o teleporte
      sortPosition = this.getRandomInt(0 , (listaCelulas.length - 1));
      this.rooms[i].teleporterFinal.setPosition(listaCelulas[sortPosition]);
      this.rooms[i].teleporterFinal.roomNumber = this.rooms[i].number;
      this.rooms[i].teleporterFinal.gy = listaCelulas[sortPosition].linha;
      this.rooms[i].teleporterFinal.gx = listaCelulas[sortPosition].coluna;
      this.rooms[i].teleporterFinal.map = this.mapa;
      this.mapa.atualizaDist(this.rooms[i].teleporterFinal.gy, this.rooms[i].teleporterFinal.gx, 0, 0);     // Atualiza distancia dos teleportes
    }

    // Posicionamento teleporte inicio de fase
    let sorteioRoomInicio = 0;

    switch(params.opcaoTeleporteInicio){
      case 0:                       // Posicionamento do inicio de fase na SALA 1
        {                                                                   // Cria um escopo local e não gera conflito de variaveis nas outras opções do switch
          let maxDist = this.rooms[sorteioRoomInicio].getMaxDist(0);                                    // Maxima distancia dos teleportes
          let criterio = Math.floor((params.porcentagem * maxDist)/100);                                 // Porcentagem da distancia maxima
          let listaCelulas = this.rooms[sorteioRoomInicio].getCellsByDist(criterio, 0);                 // Listagem de celulas dentro do criterio de escolha para o teleporte
          sortPosition = this.getRandomInt(0 , (listaCelulas.length - 1));
          this.teleporteInicioLevel.gx = listaCelulas[sortPosition].coluna;    
          this.teleporteInicioLevel.gy = listaCelulas[sortPosition].linha;
          this.teleporteInicioLevel.roomNumber = 1;
          this.teleporteInicioLevel.x = this.mapa.s * this.teleporteInicioLevel.gx + this.mapa.s/2;
          this.teleporteInicioLevel.y = this.mapa.s * this.teleporteInicioLevel.gy + this.mapa.s/2;
          this.teleporteInicioLevel.map = this.mapa;
          this.mapa.atualizaDist(this.teleporteInicioLevel.gy, this.teleporteInicioLevel.gx, 0, 0);     // Atualiza distancia dos teleportes
        }
        break;
      case 1:                       // Posicionamento aleatório de sala do inicio de fase
      {
        sorteioRoomInicio = this.getRandomInt(0 , (this.rooms.length - 1));
        let maxDist = this.rooms[sorteioRoomInicio].getMaxDist(0);                          // Maxima distancia dos teleportes
        let criterio = Math.floor((params.porcentagem * maxDist)/100);                       // Porcentagem da distancia maxima
        let listaCelulas = this.rooms[sorteioRoomInicio].getCellsByDist(criterio, 0);       // Listagem de celulas dentro do criterio de escolha para o teleporte
        sortPosition = this.getRandomInt(0 , (listaCelulas.length - 1));
        this.teleporteInicioLevel.gx = listaCelulas[sortPosition].coluna;    
        this.teleporteInicioLevel.gy = listaCelulas[sortPosition].linha;
        this.teleporteInicioLevel.roomNumber = 1;
        this.teleporteInicioLevel.x = this.mapa.s * this.teleporteInicioLevel.gx + this.mapa.s/2;
        this.teleporteInicioLevel.y = this.mapa.s * this.teleporteInicioLevel.gy + this.mapa.s/2;
        this.teleporteInicioLevel.map = this.mapa;
        this.mapa.atualizaDist(this.teleporteInicioLevel.gy, this.teleporteInicioLevel.gx, 0, 0);     // Atualiza distancia dos teleportes
      }
        break;
    }

    switch(params.opcaoTeleporteFinal){
      case 0:                       // Pode ser na mesma sala do teleporte de Inicio de fase
        {
          let salaTeleporteFinal = this.getRandomInt(0, this.rooms.length - 1);                 // Possibilita ter o teleporte de FINAL DE FASE na mesma sala de início
          let maxDist = this.rooms[salaTeleporteFinal].getMaxDist(0);                                    // Maxima distancia dos teleportes
          let criterio = Math.floor((params.porcentagem * maxDist)/100);                                 // Porcentagem da distancia maxima
          let listaCelulas = this.rooms[salaTeleporteFinal].getCellsByDist(criterio, 0);                 // Listagem de celulas dentro do criterio de escolha para o teleporte
          sortPosition = this.getRandomInt(0 , (listaCelulas.length - 1));
          this.teleporteFinalLevel.gx = listaCelulas[sortPosition].coluna;    
          this.teleporteFinalLevel.gy = listaCelulas[sortPosition].linha;
          this.teleporteFinalLevel.roomNumber = 1;
          this.teleporteFinalLevel.x = this.mapa.s * this.teleporteFinalLevel.gx + this.mapa.s/2;
          this.teleporteFinalLevel.y = this.mapa.s * this.teleporteFinalLevel.gy + this.mapa.s/2;
          this.teleporteFinalLevel.map = this.mapa;
          this.mapa.atualizaDist(this.teleporteFinalLevel.gy, this.teleporteFinalLevel.gx, 0, 0);     // Atualiza distancia dos teleportes
        }
        break;
      case 1:                       // Ser na sala diferente do teleporte de Inicio de fase
        {
          let salaTeleporteFinal = this.getRandomInt(0, this.rooms.length - 1);         // Possibilita ter o teleporte de FINAL DE FASE na mesma sala de início
          while(salaTeleporteFinal == sorteioRoomInicio){                               // Certifica de não repetir a sala
            salaTeleporteFinal = this.getRandomInt(0, this.rooms.length - 1);
          }
          let maxDist = this.rooms[salaTeleporteFinal].getMaxDist(0);                          // Maxima distancia dos teleportes
          let criterio = 
                  Math.floor((params.porcentagem * maxDist)/100);                       // Porcentagem da distancia maxima
          let listaCelulas = this.rooms[salaTeleporteFinal].getCellsByDist(criterio, 0);       // Listagem de celulas dentro do criterio de escolha para o teleporte
          sortPosition = this.getRandomInt(0 , (listaCelulas.length - 1));
          this.teleporteFinalLevel.gx = listaCelulas[sortPosition].coluna;    
          this.teleporteFinalLevel.gy = listaCelulas[sortPosition].linha;
          this.teleporteFinalLevel.roomNumber = 1;
          this.teleporteFinalLevel.x = this.mapa.s * this.teleporteFinalLevel.gx + this.mapa.s/2;
          this.teleporteFinalLevel.y = this.mapa.s * this.teleporteFinalLevel.gy + this.mapa.s/2;
          this.teleporteFinalLevel.map = this.mapa;
          this.mapa.atualizaDist(this.teleporteFinalLevel.gy, this.teleporteFinalLevel.gx, 0, 0);     // Atualiza distancia dos teleportes
        }
        break;
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

    roomsClosed.push(roomsAvaliable[indAvaliableRoom]);           //roomsClosed.push(this.rooms[roomsAvaliable[indAvaliableRoom] - 1].number);
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
    this.rooms[i].teleporterInitial.mover(dt);
    this.rooms[i].teleporterFinal.mover(dt);
  }
}

Level.prototype.dadosSalas = function(){
  for(let i = 0; i < this.rooms.length; i++){
    console.log("Sala " + this.rooms[i].number + " : ");
    console.log("teleporterInitial: ["+
      (this.rooms[i].teleporterInitial.y - this.rooms[i].teleporterInitial.s/2)/this.rooms[i].teleporterInitial.map.s
      +"]"+"["+
      (this.rooms[i].teleporterInitial.x - this.rooms[i].teleporterInitial.s/2)/this.rooms[i].teleporterInitial.map.s
      +"]");
    console.log("teleporterFinal: ["+
      (this.rooms[i].teleporterFinal.y - this.rooms[i].teleporterFinal.s/2)/this.rooms[i].teleporterFinal.map.s
      +"]"+"["+
      (this.rooms[i].teleporterFinal.x - this.rooms[i].teleporterFinal.s/2)/this.rooms[i].teleporterFinal.map.s
      +"]");
  }
}

/**
 * Posiciona o player e os teleportes de inicio e final de fase
 */
Level.prototype.posicionarPlayer = function(p){
  p.map = this.mapa;
  p.x = this.teleporteInicioLevel.x;
  p.y = this.teleporteInicioLevel.y;
}

/********************************
 * Calcula a matriz de distancias
 ********************************/

Level.prototype.atualizaMatrizDistancias = function(){
  for(let i = 0; i < this.rooms.length; i++){        //Começa a analisar a partir da próxima sala
    if(i == (this.teleporteInicioLevel.roomNumber - 1)){
      this.mapa.atualizaDist(this.teleporteInicioLevel.gy, this.teleporteInicioLevel.gx, 0, 1);                   // Firezones
      this.mapa.atualizaDist(this.teleporteInicioLevel.gy, this.teleporteInicioLevel.gx, 0, 2);                   // Inimigos
      this.mapa.atualizaDist(this.teleporteInicioLevel.gy, this.teleporteInicioLevel.gx, 0, 3);                   // Tesouros
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 1);     // Firezones
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 2);     // Inimigos
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 3);     // Tesouros
    }
    else{
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 1);     // Firezones
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 2);     // Inimigos
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 3);     // Tesouros
    }
    
  }
}

Level.prototype.posicionarFireZones = function(valor){

  //Posiciona nos teleportes das salas
  this.posicionarFireZonesTeleportes(valor);

  //Posiciona na primeira distancia 35 e depois recalcula
  let terminouPosicionamento = false;
  let indiceSala = 0;
  while(!terminouPosicionamento){
    let auxRoom = this.rooms[indiceSala];
    let listaCelulas = auxRoom.getCellsByDist(valor, 1);            //auxRoom.getCellByDist(valor, 1);
    let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length)];

    while(celula != null){
      let auxFireZone = new FireZone();
      auxFireZone.gx = celula.coluna;
      auxFireZone.gy = celula.linha;
      auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
      auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
      auxFireZone.map = this.mapa;
      auxRoom.fireZones.push(auxFireZone);
      this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula
      celula = auxRoom.getCellByDist(valor, 1);                     // valor, codigo para firezones
    }

    indiceSala++;

    if(indiceSala >= this.rooms.length){
      terminouPosicionamento = true;
    }
  }
}

/**
 * Posiciona as firezones nos teleportes
 */
Level.prototype.posicionarFireZonesTeleportes = function(valor){

  /**
   * Posiciona na primeira distancia 35 e depois recalcula
   * 
   * Teleporte inicial e final de level
   */
  let auxRoom = this.rooms[this.teleporteInicioLevel.roomNumber - 1];
  let celula = this.teleporteInicioLevel.getCell();
  let auxFireZone = new FireZone();
  auxFireZone.gx = celula.coluna;
  auxFireZone.gy = celula.linha;
  auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
  auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
  auxFireZone.map = this.mapa;
  auxRoom.fireZones.push(auxFireZone);
  this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula

  auxRoom = this.rooms[this.teleporteFinalLevel.roomNumber - 1];
  celula = this.teleporteFinalLevel.getCell();
  auxFireZone = new FireZone();
  auxFireZone.gx = celula.coluna;
  auxFireZone.gy = celula.linha;
  auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
  auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
  auxFireZone.map = this.mapa;
  auxRoom.fireZones.push(auxFireZone);
  this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula

  /**
  * Teleportes nas salas
  */

  let terminouPosicionamento = false;
  let indiceSala = 0;
  while(!terminouPosicionamento){
    auxRoom = this.rooms[indiceSala];
    celula = this.mapa.getCell(auxRoom.teleporterInitial.gy, auxRoom.teleporterInitial.gx);

    // No teleporte inicial
    auxFireZone = new FireZone();
    auxFireZone.gx = celula.coluna;
    auxFireZone.gy = celula.linha;
    auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
    auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
    auxFireZone.map = this.mapa;
    auxRoom.fireZones.push(auxFireZone);
    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula

    // No teleporte final
    celula = this.mapa.getCell(auxRoom.teleporterFinal.gy, auxRoom.teleporterFinal.gx);
    auxFireZone = new FireZone();
    auxFireZone.gx = celula.coluna;
    auxFireZone.gy = celula.linha;
    auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
    auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
    auxFireZone.map = this.mapa;
    auxRoom.fireZones.push(auxFireZone);
    this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula

    indiceSala++;

    if(indiceSala >= this.rooms.length){
      terminouPosicionamento = true;
    }
  }
}

/**
 * Tesouros
 */

Level.prototype.posicionarTesouros = function(valor){

  //Posiciona na primeira distancia 35 e depois recalcula
  let terminouPosicionamento = false;
  let indiceSala = 0;
  while(!terminouPosicionamento){
    let auxRoom = this.rooms[indiceSala];
    let listaCelulas = auxRoom.getCellsByDist(valor, 3);            //auxRoom.getCellByDist(valor, 1);
    let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length)];

    while(celula != null){
      let auxFireZone = new FireZone();
      auxFireZone.gx = celula.coluna;
      auxFireZone.gy = celula.linha;
      auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
      auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
      auxFireZone.map = this.mapa;
      auxRoom.fireZones.push(auxFireZone);
      this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula
      celula = auxRoom.getCellByDist(valor, 1);                     // valor, codigo para firezones
    }

    indiceSala++;

    if(indiceSala >= this.rooms.length){
      terminouPosicionamento = true;
    }
  }
}

/*Level.prototype.toggleLevel = function(l){
  this = JSON.parse(JSON.stringify(l));  //Copia matriz

}*/

// Copia as salas do método de geração de fase e atualiza a matriz do mapa
// os blocos são compostos por posições de linha e coluna ao inves de referencia pra matriz
Level.prototype.copiaSalas = function(rooms){
  this.rooms = [];
  //console.log("COPIA SALAS:");
  //console.log(rooms);
  for(let i = 0; i < rooms.length; i++){
     this.rooms.push(new Room(0));
     this.rooms[this.rooms.length - 1].copyByLevelGeneration(rooms[i], this.mapa);
  }

}

Level.prototype.copiaSalasComReferencia = function(rooms){
  this.rooms = [];
  //console.log("COPIA SALAS COM REFERENCIA:");
  for(let i = 0; i < rooms.length; i++){
     this.rooms.push(new Room(0));
     this.rooms[this.rooms.length - 1].copyWithReference(rooms[i], this.mapa);
  }
}

Level.prototype.desenhar = function(ctx) {
  this.mapa.desenhar(ctx);
  this.teleporteInicioLevel.desenhar(ctx);
  this.teleporteFinalLevel.desenhar(ctx);
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].draw(ctx);
  }
};

// Testa as colisões do player com as firezones
Level.prototype.colisaoFireZones = function(player){
  let verificaColisao = false;
  for(let i = 0; i < this.rooms.length; i++){
    let auxFireZones = this.rooms[i].fireZones;
    for(let j = 0; j < auxFireZones.length; j++){
      if(player.colidiuCom2(auxFireZones[j])){
        verificaColisao = true;
        break;
      }
    }
  }

  if(verificaColisao){
    player.morre = false;
    this.tempoFase = this.tempoTotal;
  }
  else{
    player.morre = true;
  }
}
