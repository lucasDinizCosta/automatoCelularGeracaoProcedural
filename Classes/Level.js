function Level(w, h, s) {
  this.mapa = new Map(w,h,s);
  this.rooms = [];
  this.tempoFase = 0;
  this.tempoTotal = 0;
  this.taxaDiminuicaoTempo = 0;
  this.tempo = undefined;
  this.tamanhoSalasMinimo = 25;
  this.larguraBarra = 127;
  this.teleporteInicioLevel = new Teleporter(0);         //(Inicio) mapa
  this.teleporteFinalLevel  = new Teleporter(1);        //(Final) mapa
  this.player = undefined;
  this.hud = hud;
  this.filaDesenho = [];
};

/**
 * GX => Coluna;
 * GY => Linha
 */

//Level.prototype = new Level();
Level.prototype.constructor = Level;

Level.prototype.setTempo = function(tempo){
  this.tempoFase = tempo;
  this.tempoTotal = tempo;
  //this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
};

Level.prototype.setTaxaDiminuicaoTempo = function(dt, barra){
  /**
   * tempoTotal --- larguraBarra  |    X = (larguraBarra * dt)/tempoTotal
   *     dt     ---     X         |
   */
  this.tempo = barra;
  this.larguraBarra = barra.w;
  this.taxaDiminuicaoTempo = (this.larguraBarra * dt)/this.tempoTotal; // Math.floor(larguraBarra/tempo);
};

Level.prototype.updateTempo = function(){
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
      this.mapa.cell[l][c].clone(level.mapa.cell[l][c]);
    }
  }

  this.tempoFase = level.tempoFase;
  this.tempoTotal = level.tempoTotal;
  this.taxaDiminuicaoTempo = level.taxaDiminuicaoTempo;
  this.larguraBarra = level.larguraBarra;
  this.tempo = level.tempo;                       // Referencia na memoria pra barra de tempo
  this.teleporteInicioLevel.copyTeleporte(level.teleporteInicioLevel);
  this.teleporteFinalLevel.copyTeleporte(level.teleporteFinalLevel);
  this.player = level.player;
  this.copiaSalasComReferencia(level.rooms);
}

// Copia as salas do método de geração de fase e atualiza a matriz do mapa
// os blocos são compostos por posições de linha e coluna ao inves de referencia pra matriz

// USA O BLOCKS[ID, linha/coluna]
Level.prototype.copiaSalas = function(rooms){
  this.rooms = [];
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
     // Passado o vetor de rooms para poder clonar o teleporte para a proxima sala
  }

  // Copia as referencias do proximo teleporte
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].teleporterInitial.copyConnection(rooms[i].teleporterInitial, this.rooms);
    this.rooms[i].teleporterFinal.copyConnection(rooms[i].teleporterFinal, this.rooms);
  }
}

/**
 * Utiliza o gerador de seed como referencia pra escolha numerica
 */
Level.prototype.getRandomInt = function(min, max){
  return seedGen.getRandomIntMethod_1(min, max); 
}

Level.prototype.caminhoColetaTesouros = function(){
  /*
  teleporteInicioLevel
  teleportefinalLevel
  */
  let salas = [];
  for(let i = 0; i < this.rooms.length; i++){
    salas.push(false);
  }
  let salaInicial = this.rooms[this.teleporteInicioLevel.getCell().room - 1];
  let indiceSala = salaInicial.room - 1;
  while(!salas[indiceSala]){

  }
  //console.log(salaInicial);

  for(let i = 0; i < this.rooms.length; i++){
    //this.rooms[i].caminhoColetaTesouros();

  }  
}

/**
 * -> Atribui os teleportes dentro das salas e insere nos blocos A REFERENCIA PARA O MAPA
 * -> Posiciona de forma com base na DISTÂNCIA DOS TELEPORTES
 * 
 *  porcentagem: Intervalo de distância
 *  params:{porcentagem, opcaoTeleporteInicio, opcaoTeleporteFinal}
 */

Level.prototype.posicionarTeleportes = function(params){
  if(this.rooms.length > 1){          //Only will have teleporters if there are more than one room
    let indAvaliableRoom;
    let indFinishRoom;
    let roomsAvaliable = [];            //Rooms disponiveis para escolher o teleporte inicial
    let roomsClosed = [];               //Rooms que o teleporte inicial foi conectado
    let sortPosition;
    //let blocks = [];

    // posicionando todos os teleportes de inicio de sala
    for(let i = 0; i < this.rooms.length; i++){   
      // Prepocessamento -- Pega o bloco do meio da sala, calcula a distancia, pega o bloco
      // da maior, zera a distancia, posiciona o bloco e calcula a distancia de novo
      
      let blocoMedio = Math.floor(this.rooms[i].blocks.length/2) - 1;
      this.mapa.atualizaDist(this.rooms[i].blocks[blocoMedio].linha, this.rooms[i].blocks[blocoMedio].coluna, 0, 0);     // Atualiza distancia dos teleportes
      let maxDist = this.rooms[i].getMaxDist(0);
      let celulas = this.rooms[i].getCellsByDist(maxDist, 0);
      sortPosition = this.getRandomInt(0 , (celulas.length - 1));
      this.rooms[i].resetDistancia(0);

      // Posicionamento teleporte de inicio de sala
      this.rooms[i].teleporterInitial.setPosition(celulas[sortPosition]);
      this.rooms[i].teleporterInitial.roomNumber = celulas[sortPosition].room;
      this.rooms[i].teleporterInitial.gy = celulas[sortPosition].linha;
      this.rooms[i].teleporterInitial.gx = celulas[sortPosition].coluna;
      this.rooms[i].teleporterInitial.map = this.mapa;
      this.mapa.atualizaDist(this.rooms[i].teleporterInitial.gy, this.rooms[i].teleporterInitial.gx, 0, 0);     // Atualiza distancia dos teleportes
      roomsAvaliable.push(this.rooms[i].number);                                                                // Vetor de salas disponíveis na hora realizar a ligação entre elas

      // Posicionamento de final de sala
      celulas = [];
      maxDist = this.rooms[i].getMaxDist(0);                       // Maxima distancia dos teleportes
      let criterio = Math.floor((params.porcentagem * maxDist)/100);   // Porcentagem da distancia maxima
      celulas = this.rooms[i].getCellsByDist(criterio, 0);    // Listagem de celulas dentro do criterio de escolha para o teleporte
      sortPosition = this.getRandomInt(0 , (celulas.length - 1));
      
      this.rooms[i].teleporterFinal.setPosition(celulas[sortPosition]);
      this.rooms[i].teleporterFinal.roomNumber = celulas[sortPosition].room;
      this.rooms[i].teleporterFinal.gy = celulas[sortPosition].linha;
      this.rooms[i].teleporterFinal.gx = celulas[sortPosition].coluna;
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
          this.teleporteInicioLevel.roomNumber = this.rooms[sorteioRoomInicio].number;
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
        this.teleporteInicioLevel.roomNumber = this.rooms[sorteioRoomInicio].number;
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
          this.teleporteFinalLevel.roomNumber = this.rooms[salaTeleporteFinal].number;
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
          this.teleporteFinalLevel.roomNumber = this.rooms[salaTeleporteFinal].number;
          this.teleporteFinalLevel.x = this.mapa.s * this.teleporteFinalLevel.gx + this.mapa.s/2;
          this.teleporteFinalLevel.y = this.mapa.s * this.teleporteFinalLevel.gy + this.mapa.s/2;
          this.teleporteFinalLevel.map = this.mapa;
          this.mapa.atualizaDist(this.teleporteFinalLevel.gy, this.teleporteFinalLevel.gx, 0, 0);     // Atualiza distancia dos teleportes
        }
        break;
    }
    
    //GX => COLUNA, GY => LINHA


    /**************************************************************
     * LIGANDO OS TELEPORTES ENTRE AS SALAR DE MANEIRA CIRCULAR   *
     **************************************************************/

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

/**
 * Posiciona o player e os teleportes de inicio e final de fase
 */
Level.prototype.posicionarPlayer = function(p){
  p.map = this.mapa;
  p.x = this.teleporteInicioLevel.x;
  p.y = this.teleporteInicioLevel.y;      
  p.gx = this.teleporteInicioLevel.gx;            // Coluna
  p.gy = this.teleporteInicioLevel.gy;            // Linha

  // Referencia ao player para facilitar
  this.player = p;
}

Level.prototype.posicionarFireZones = function(valor){

  //Posiciona nos teleportes das salas
  this.posicionarFireZonesTeleportes();

  //Posiciona na primeira distancia 35 e depois recalcula
  /*let terminouPosicionamento = false;
  let indiceSala = 0;
  while(!terminouPosicionamento){
    let auxRoom = this.rooms[indiceSala];
    let listaCelulas = auxRoom.getCellsByDist(valor, 1);            //auxRoom.getCellByDist(valor, 1);
    let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];

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
  }*/

  for(let i = 0; i < this.rooms.length; i++){
    let auxRoom = this.rooms[i];
    let listaCelulas = [];
    do{
      listaCelulas = [];
      for(let j = 0; j < auxRoom.blocks.length; j++){
        if(auxRoom.blocks[j].distFirezones === valor){
          listaCelulas.push(auxRoom.blocks[j]);
        }
      }
      if(listaCelulas.length > 0){
        let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
        let auxFireZone = new FireZone();
        auxFireZone.gx = celula.coluna;
        auxFireZone.gy = celula.linha;
        auxFireZone.x = celula.coluna * this.mapa.s + auxFireZone.s/2;
        auxFireZone.y = celula.linha * this.mapa.s + auxFireZone.s/2;
        auxFireZone.map = this.mapa;
        auxRoom.fireZones.push(auxFireZone);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula
        celula = auxRoom.getCellByDist(valor, 1);  
      }
    }
    while(listaCelulas.length != 0);
  }
}

/**
 * Posiciona as firezones nos teleportes
 */
Level.prototype.posicionarFireZonesTeleportes = function(){

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
  auxFireZone.x = this.teleporteInicioLevel.x;
  auxFireZone.y = this.teleporteInicioLevel.y;
  auxFireZone.map = this.mapa;
  auxRoom.fireZones.push(auxFireZone);
  this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 1);     //Recalcula

  auxRoom = this.rooms[this.teleporteFinalLevel.roomNumber - 1];
  celula = this.teleporteFinalLevel.getCell();
  auxFireZone = new FireZone();
  auxFireZone.gx = celula.coluna;
  auxFireZone.gy = celula.linha;
  auxFireZone.x = this.teleporteFinalLevel.x;
  auxFireZone.y = this.teleporteFinalLevel.y;
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

Level.prototype.posicionarTesouros = function(params){

  /**
   * Metodo antigo de posicionamento
   */

  /*if(params.porcentagemTesourosPorSala != 0){     // Utiliza o tamanho da sala como referencia posicionar os elementos
    let terminouPosicionamento = false;
    let indiceSala = 0;
    while(!terminouPosicionamento){
      let auxRoom = this.rooms[indiceSala];
      let listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});            //auxRoom.getCellByDist(valor, 1);
      let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
      let qtdTesouros = Math.ceil((params.porcentagemTesourosPorSala * auxRoom.blocks.length)/100);   // Número de tesouros varia conforme o tamanho da sala

      for(let i = 0; i < qtdTesouros; i++){
        let auxTreasure = new Treasure();
        auxTreasure.gx = celula.coluna;
        auxTreasure.gy = celula.linha;
        auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s/2;
        auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s/2;
        auxTreasure.map = this.mapa;
        auxRoom.treasures.push(auxTreasure);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);     // Recalcula
        listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});     // Nova lista de celulas disponiveis         //auxRoom.getCellByDist(valor, 1);
        celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
      }

      indiceSala++;

      if(indiceSala >= this.rooms.length){
        terminouPosicionamento = true;
      }
    }
  }
  else{                             // Posiciona uma quantidade fixa de tesouros em cada sala
    let terminouPosicionamento = false;
    let indiceSala = 0;
    while(!terminouPosicionamento){
      let auxRoom = this.rooms[indiceSala];
      let listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});            //auxRoom.getCellByDist(valor, 1);
      let celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];

      for(let i = 0; i < params.qtdTesouros; i++){
        let auxTreasure = new Treasure();
        auxTreasure.gx = celula.coluna;
        auxTreasure.gy = celula.linha;
        auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s/2;
        auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s/2;
        auxTreasure.map = this.mapa;
        auxRoom.treasures.push(auxTreasure);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);     // Recalcula
        listaCelulas = auxRoom.getEmptyCellsByPercentageBetweenMaxDist({option: 3, porcentagem: params.porcentagemDistancia});     // Nova lista de celulas disponiveis         //auxRoom.getCellByDist(valor, 1);
        celula = listaCelulas[this.getRandomInt(0, listaCelulas.length - 1)];
      }

      indiceSala++;

      if(indiceSala >= this.rooms.length){
        terminouPosicionamento = true;
      }
    }
  }*/

  /*
  * Metodo novo de posicionamento de inimigos
  */

  for(let indiceSala = 0; indiceSala < this.rooms.length; indiceSala++){
    let auxRoom = this.rooms[indiceSala];
    let listaCelulas = [...auxRoom.blocks.filter((b) => ((b.distTeleportes >= 5) 
    && (b.distFirezones > 0) && (b.distInimigos > 0)))];        // Todos os blocks da sala com distTeleportes maior que 5
    let listaCelulasFinal = [];
    let numTesouros = Math.round(auxRoom.blocks.length/this.tamanhoSalasMinimo);    // /25
    let distMaxTeleporte = auxRoom.getMaxDist(0);
    let distMaxTesouros = auxRoom.getMaxDist(1);
    let distMaxInimigos = auxRoom.getMaxDist(2);

    do{
      let maxDistComposto = auxRoom.getMaxDist(5);            // Valor referencial maximo nao vai mudar
      let minimalValue = Math.round((params.porcentagemDistancia * distMaxTesouros)/100);                 // Menor elemento no intervalo para o DistInimigos
      let minimalValueComposto = (params.porcentagemDistanciaComp)/100;
      listaCelulasFinal = [];

      
      // Verifica a distancia composta
      for(let i = 0; i < listaCelulas.length; i++){       // preenche a lista de celulas disponiveis --- Dist Inimigos
        let auxDistanciaNormalizada = listaCelulas[i].distInimigo_Tesouro_Teleporte(distMaxInimigos, 
          distMaxTeleporte, distMaxTesouros);
        if((minimalValueComposto <= auxDistanciaNormalizada) //&& 
        //(auxDistanciaNormalizada <= minimalValueComposto * 1.5)
        && (listaCelulas[i].distTesouros >= 5)           // Evita inimigos muito próximos
        ){
          listaCelulasFinal.push(listaCelulas[i]);
        }
      }

      if(listaCelulasFinal.length > 0){
        let celula = listaCelulasFinal[this.getRandomInt(0, listaCelulasFinal.length - 1)];
        let auxTreasure = new Treasure();
        auxTreasure.gx = celula.coluna;
        auxTreasure.gy = celula.linha;
        auxTreasure.x = celula.coluna * this.mapa.s + this.mapa.s/2;
        auxTreasure.y = celula.linha * this.mapa.s + this.mapa.s/2;
        auxTreasure.map = this.mapa;
        auxRoom.treasures.push(auxTreasure);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 3);     // Recalcula
      }
    }
    while(numTesouros-- > 0 && listaCelulasFinal.length > 0);
  }
}

Level.prototype.posicionarInimigos = function(params){
  for(let indiceSala = 0; indiceSala < this.rooms.length; indiceSala++){
    let auxRoom = this.rooms[indiceSala];
    let listaCelulas = [...auxRoom.blocks.filter((b) => ((b.distTeleportes >= 5) && (b.distFirezones > 0)))];        // Todos os blocks da sala com distTeleportes maior que 5
    let listaCelulasFinal = [];
    let numInimigos = Math.round(auxRoom.blocks.length/this.tamanhoSalasMinimo);    // /25
    let distMaxTeleporte = auxRoom.getMaxDist(0);

    do{
      let maxDistInimigos = auxRoom.getMaxDist(2);
      let maxDistComposto = auxRoom.getMaxDist(4);            // Valor referencial maximo nao vai mudar
      let minimalValue = Math.round((params.porcentagemDistancia * maxDistInimigos)/100);                 // Menor elemento no intervalo para o DistInimigos
      let minimalValueComposto = (params.porcentagemDistanciaComp)/100;                 // Menor elemento no intervalo para o DistInimigos
      //listaCelulas = [...auxRoom.blocks.filter((b) => (b.distTeleportes >= 5))];        // Todos os blocks da sala com distTeleportes maior que 5
      listaCelulasFinal = [];

      
      // Verifica a distancia composta
      for(let i = 0; i < listaCelulas.length; i++){       // preenche a lista de celulas disponiveis --- Dist Inimigos
        /*let auxDistanciaNormalizada = auxRoom.blocks[i].distInimigoTeleporte(auxRoom.distancias.maxInimigos, 
          auxRoom.distancias.maxTeleportes);*/
        let auxDistanciaNormalizada = listaCelulas[i].distInimigoTeleporte(maxDistInimigos, 
          distMaxTeleporte);
        if((minimalValueComposto <= auxDistanciaNormalizada) //&& 
        //(auxDistanciaNormalizada <= minimalValueComposto * 1.5)
        && (listaCelulas[i].distInimigos > 5)           // Evita inimigos muito próximos
        ){
          listaCelulasFinal.push(listaCelulas[i]);
        }
      }

      if(listaCelulasFinal.length > 0){
        let celula = listaCelulasFinal[this.getRandomInt(0, listaCelulasFinal.length - 1)];
        let auxEnemy = new Enemy();
        auxEnemy.gx = celula.coluna;
        auxEnemy.gy = celula.linha;
        auxEnemy.x = celula.coluna * this.mapa.s + this.mapa.s/2;
        auxEnemy.y = celula.linha * this.mapa.s + this.mapa.s/2;
        auxEnemy.map = this.mapa;
        auxRoom.enemies.push(auxEnemy);
        this.mapa.atualizaDist(celula.linha, celula.coluna, 0, 2);     // Recalcula
      }
    }
    while(numInimigos-- > 0 && listaCelulasFinal.length > 0);
  }
}

Level.prototype.movimento = function(dt) {
  this.player.moverCompleto(dt);
  this.colisaoTeleportes(this.player);
  this.colisaoFireZones(this.player);
  //this.colisaoInimigos(this.player);
  this.colisaoTesouros(this.player);
  this.validaAtaquePlayerInimigo(this.player);
  if(!this.player.imune){
    this.rooms[this.player.room - 1].atackEnemiesPlayer(this.player);      // Ataque somente na sala do player
  }
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].move(dt);
  }
  this.removerInimigos();
  this.criarFilaDesenho();
}

Level.prototype.montarLevel = function(params){
  this.posicionarTeleportes({
    porcentagem: 100, opcaoTeleporteInicio: 1, opcaoTeleporteFinal: 1

    /**********************************************************************
     * Posiciona os teleportes com base na DISTANCIA entre eles           *
     * opcaoTeleporteInicio:                                              *
     *  0 => Posicionamento na SALA 1;  1 => Posicionamento Aleatório;    *
     *                                                                    *
     * opcaoTeleporteFinal:                                               *
     *  0 => Final poder ficar na mesma sala do teleporte inicial;        *
     *  1 => Final na sala diferente do teleporte inicial;                *
     *********************************************************************/
  });
  this.atualizaGradeTeleportes(params.dt);
  this.posicionarPlayer(params.player);
  this.posicionarFireZones(25);          // Posiciona acima de 25 na distancia de firezones
  this.posicionarInimigos({
    porcentagemDistancia: 80,             
    porcentagemDistanciaComp: 50,         
  });

  this.posicionarTesouros({
    //porcentagemDistancia: 90, qtdTesouros: 0, porcentagemTesourosPorSala: 5
    porcentagemDistancia: 80,             
    porcentagemDistanciaComp: 50,  
    
    // porcentagemTesourosPorSala != 0 ==> Posiciona de acordo com o tamanho da sala
    
  });

  
  /* Distancias maximas em cada sala */
  for(let i = 0; i < this.rooms.length; i++){
    this.rooms[i].maxCamadaDistancias();
  }

  this.mapa.camadaDistCompostas();
}

Level.prototype.getPlayerRoom = function(){
  return (this.rooms[this.player.room - 1]);
}

Level.prototype.criarFilaDesenho = function(){
  this.filaDesenho = [];
  // Desenhos que não seguirão a ordem de prioridade no eixo y
  for(let i = 0; i < this.rooms.length; i++){       
    let auxRoom = this.rooms[i];
    for(let j = 0; j < auxRoom.fireZones.length; j++){
      this.filaDesenho.push(auxRoom.fireZones[j]);
    }
    this.filaDesenho.push(auxRoom.teleporterInitial);
    this.filaDesenho.push(auxRoom.teleporterFinal);
  }
  this.filaDesenho.push(this.teleporteInicioLevel);
  this.filaDesenho.push(this.teleporteFinalLevel);

  let indiceInicioOrdenacao = this.filaDesenho.length - 1;

  // Desenhos que seguirão a ordem de prioridade no eixo y
  this.filaDesenho.push(this.player);
  for(let i = 0; i < this.rooms.length; i++){
    let auxRoom = this.rooms[i];
    for(let j = 0; j < auxRoom.enemies.length; j++){
      this.filaDesenho.push(auxRoom.enemies[j]);
    }
    for(let j = 0; j < auxRoom.treasures.length; j++){
      this.filaDesenho.push(auxRoom.treasures[j]);
    }
  }

  let ordenacao = new Ordenacao();
  ordenacao.quickSort({
    lista: this.filaDesenho,
    inicio: indiceInicioOrdenacao, 
    fim: this.filaDesenho.length - 1, 
    criterio: 1,    // Eixo Y
    ordem: 0        // Crescente
  });
}

Level.prototype.desenhar = function(ctx) {
  this.mapa.desenhar(ctx);
  for(let i = 0; i < this.filaDesenho.length; i++){
    this.filaDesenho[i].desenhar(ctx);
  }
  this.mapa.desenharDebugMode(ctx);

  if(debugMode > 3){
    for(let i = 0; i < this.rooms.length; i++){
      this.rooms[i].desenharCamadas({
        ctx: ctx, s: this.mapa.s
      });
    }
  }
  else{
    if(debugMode === 3){
      for(let i = 0; i < this.rooms.length; i++){
        this.rooms[i].drawTeleportersLine(ctx);
      }
    }
  }
};

Level.prototype.removerInimigos = function(){
  // Otimização: Inimigos atacados pelo player sempre estão na mesma sala

  for(let i = 0; i < this.rooms.length; i++){
    let inimigos = this.rooms[i].enemies;
    for(let j = 0; j < inimigos.length; j++){
      if(inimigos[j].hp <= 0){
        inimigos.splice(j, 1);
      }
    }
  }
}

/**********************
 * Colisões e ataques *
 **********************/

Level.prototype.colisaoTeleportes = function(player){
  let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
  if(player.teclas.space){
    if(player.cooldownTeleporte < 0){
      if(auxRoom.teleporterInitial.colidiuCom2(player)){
        auxRoom.teleporterInitial.teleportar(player);
        //this.hud.bussola.update();
      }
      else if(auxRoom.teleporterFinal.colidiuCom2(player)){
        auxRoom.teleporterFinal.teleportar(player);
        //this.hud.bussola.update();
      }
      player.cooldownTeleporte = 1;
    }
  }
}

Level.prototype.colisaoFireZones = function(player){
  let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
  if(auxRoom.collisionFirezones(player)){             // Checa colisão com as firezones
    this.tempo.w = this.larguraBarra;
  }
}

// Testa as colisões do player com as firezones
Level.prototype.colisaoInimigos = function(player){
  let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
  if(auxRoom.collisionEnemies(player)){           
    player.vivo = false;
    console.log("Colidiu com inimigos");
  }
}

Level.prototype.validaAtaquePlayerInimigo = function(player){
  //let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
  let inimigos = this.rooms[player.room - 1].enemies;
  if(player.atacando === 1 && player.cooldownAtaque > 0){
    for(let i = 0; i < inimigos.length; i++){
      if(player.atacarModoPlayer(inimigos[i])){
        console.log("Ataque Player no inimigo");
        inimigos[i].hp -= 30;
      }
    }
  }
}

Level.prototype.colisaoTesouros = function(player){
  let auxRoom = this.rooms[player.room - 1];          // Checar somente a sala onde o player se encontra
  if(auxRoom.collisionTreasures(player)){      
    console.log("Colidiu com tesouros");
  }
}
