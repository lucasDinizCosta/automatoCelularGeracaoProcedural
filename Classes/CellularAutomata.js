function CellularAutomata(HS, WS, MOORE = 1, r = 0.5, totalRock = 5, floorIndex = 0, rockIndex = 1, wallIndex = 2){
    this.HS = HS;
    this.WS = WS;
    this.MOORE = MOORE;
    this.r = r;
    this.n;
    this.totalRock = totalRock;
    this.floorIndex = floorIndex;
    this.rockIndex = rockIndex;
    this.wallIndex = wallIndex;
    this.map = this.initMap(this.HS, this.WS, this.floorIndex);
    this.map2 = this.initMap(this.HS, this.WS, this.floorIndex);
    this.rooms = [];
}
//CellularAutomata.prototype = new CellularAutomata();
CellularAutomata.prototype.constructor = CellularAutomata;


/**
 * GX => COLUNA
 * GY => LINHA
 */

CellularAutomata.prototype.fullstep = function(steps = 2){
    while(steps > 0){
        this.gameOfWallRulesAutomata();
        this.toggleMaps();
        steps--;
    }
    this.gameOfWallRulesAutomataPutWalls();
    this.toggleMaps();
    while(this.gameOfWallRulesAutomataFinalStepCleanWalls() !== 0){ //Limpa as paredes espaçadas
        this.toggleMaps();
    }
    
    //this.gameOfWallRulesAutomataFinalStepCleanWalls();
    //this.toggleMaps();
    this.gameOfWallRulesAutomataPutWalls();
    this.toggleMaps();
}

CellularAutomata.prototype.countRooms = function(){
    let auxMatrix = this.initMap(this.HS, this.WS, -1);
    let auxMatrixVisited = [];
    let sizeRooms = [];
    let room = 0;
    let roomFloors = 0;
    let caveArea = 0;
    for(let i = 0; i < this.HS; i++){
        auxMatrixVisited[i] = [];
        for(let j = 0; j < this.WS; j++){
            auxMatrixVisited[i][j] = false;
            if(this.map[i][j] !== this.floorIndex){
                auxMatrix[i][j] = -2;   //Cave area
                caveArea++;
            }
            else{
                auxMatrix[i][j] = -1;   //rooms area
                roomFloors++;
            }
        }
    }

    for(let i = 0; i < this.HS; i++){
        for(let j = 0; j < this.WS; j++){
            if(auxMatrix[i][j] === -1){
                room++;
                this.visitCells(auxMatrix, this.map, i, j, this.floorIndex, 1, room);
            }
        }
    }

    for(let i = 0; i < room; i++){                  //Cria o numero de salas correspondentes
        this.rooms.push(new Room(i+1));
    }

    for(let i = 0; i < this.HS; i++){               //Incrementa os contadores
        for(let j = 0; j < this.WS; j++){
            if(auxMatrix[i][j] > 0){
                this.rooms[auxMatrix[i][j] - 1].addBlock(i, j);
            }
        }
    }

    let text = "Size of rooms: {";
    /*for(let i = 0; i < sizeRooms.length; i++){
        text += "( R:"+ (i+1) + " , S:" + sizeRooms[i] + " ) ; ";
    }*/
    for(let i = 0; i < this.rooms.length; i++){
        text += "( R:"+ (i+1) + " , S:" + this.rooms[i].blocks.length + " ) ; ";
    }
    text += "}"
    console.log(text);
    console.log("Number of rooms: " + room);
    console.log("Number of roomFloors: " + roomFloors);
    console.log("Number of caveArea: " + caveArea);
    console.log("Total blocks: " + this.HS*this.WS);
    /*let text = "";
    for(let i = 0; i < this.HS; i++){
        text = text + "auxMatrix ["+i+"]: {";
        for(let j = 0; j < this.WS; j++){
            text = text + " " + auxMatrix[i][j] + "("+j+"), ";
        }
        text = text + " }\n"
    }
    console.log(text);*/
}

/**
 * Remove as salas de tamanho menor que um valor determinado e aplica um automato para corrigir o mapa
 */

CellularAutomata.prototype.filterRooms = function(sizeRoomsMinimal = 10){
    let count = 0;
    while(true){
        count = 0;
        for(let i = 0; i < this.rooms.length; i++){
            if(this.rooms[i].blocks.length <= sizeRoomsMinimal){    //Remove as salas de tamanhos menores que a variavel
                for(let k = 0; k < this.rooms[i].blocks.length; k++){
                    this.map2[this.rooms[i].blocks[k][0]][this.rooms[i].blocks[k][1]] = this.rockIndex;  //Atribui como rock
                }
                count++;
                this.rooms.splice(i, 1);
            }
        }
        //console.log("rooms after removing: " + this.rooms.length);
        this.toggleMaps();
        if(count === 0){
            break;
        }
    }
    for(let i = 0; i < this.rooms.length; i++){                         //Reorder the numbers of the rooms
        this.rooms[i].number = i + 1;                                   //Initiate with number 1
    }
    this.gameOfWallRulesAutomataPutWalls();
    this.gameOfWallRulesAutomataPutWalls();
    this.gameOfWallRulesAutomataRemoveWalls();
    this.toggleMaps();
    this.gameOfWallRulesAutomataFinalStepCleanWalls();
    /*while(this.gameOfWallRulesAutomataFinalStepCleanWalls() !== 0){ //Limpa as paredes espaçadas
        this.toggleMaps();
    }*/
}

CellularAutomata.prototype.getRandomInt = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

CellularAutomata.prototype.setTeleporters = function(){
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

CellularAutomata.prototype.visitCells = function(auxMatrix, mapx, y, x, tp, d = 1, indexArea){   //visita as celulas visinhas de maneira recursiva e atribui o código da sala correspondente 
    /*********************************************
     * 
     * Algoritmo Flood fill:
     * https://en.wikipedia.org/wiki/Flood_fill
     * 
    ***********************************************/
    
    if(auxMatrix[y][x] === indexArea){  //Célula com a "cor" ou "indice da sala" correspondente ao indexArea
        return;
    }
    if(auxMatrix[y][x] === -1){         //Não mapeado ainda
        auxMatrix[y][x] = indexArea;    //Set cell is visited
    }
    else{                               //Ou foi mapeado ou a celula é Wall/Rock
        return;
    }
    if(y - 1 >= 0){
        this.visitCells(auxMatrix, mapx, y - 1, x, tp, d, indexArea);
    }
    if(y + 1 < this.HS){
        this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
    }
    if(x - 1 >= 0){
        this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
    }
    if(x + 1 < this.WS){
        this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
    }
}

CellularAutomata.prototype.countAdjacentsMoore = function(mapx, y, x, tp, d = 1){   //Conta as células de um tipo específico ao redor da célula (x,y)
    let total = 0;
    const mL = Math.max(y - d, 0);
    const ML = Math.min(y + d, mapx.length-1);
    const mC = Math.max(x - d, 0);
    const MC = Math.min(x + d, mapx[0].length-1);
    for (let l = mL; l <= ML; l++) {
        for (let c = mC; c <= MC; c++) {
            if (mapx[l][c] === tp) {
                total++;
            }
        }
    }
    if(mapx[y][x] === tp){ //Desconta o valor da celula central
        total--;
    }
    return total;
}

CellularAutomata.prototype.toggleMaps = function(){
    this.map = JSON.parse(JSON.stringify(this.map2));   //Copia matriz
}

CellularAutomata.prototype.toggleRooms = function(rooms){
    rooms = JSON.parse(JSON.stringify(this.rooms));  //Copia matriz
}

CellularAutomata.prototype.initMap = function(L, C, v) {
    let mapx = [];
    for (let l = 0; l < L; l++) {
        mapx[l] = [];
        for (let c = 0; c < C; c++) {
            mapx[l][c] = v;
        }
    }
    return mapx;
}

/**
 * 1º - Padrão descrito no artigo
 * Observa quem está ao redor de rochas e posiciona rocha ou chão no automato
 */

CellularAutomata.prototype.gameOfWallRulesAutomata = function (){
    /**
    * Types:
    *   0 => floor;
    *   1 => rock;
    *   2 => wall;
    */
    for (let l = 0; l < this.map2.length; l++) {
        for (let c = 0; c < this.map2[0].length; c++) {
            this.map2[l][c] = this.map[l][c];
            if(this.countAdjacentsMoore(this.map, l, c, this.rockIndex, this.Moore) >= this.totalRock){ 
                this.map2[l][c] = this.rockIndex;
            }else{
                this.map2[l][c] = this.floorIndex;
            }
        }
    }
}

/**
 * 2º - Padrão descrito no artigo
 * Posiciona os walls ao redor das cavernas
 */

CellularAutomata.prototype.gameOfWallRulesAutomataPutWalls = function (){
    /**
    * Types:
    *   0 => floor;
    *   1 => rock;
    *   2 => wall;
    */
    for (let l = 0; l < this.map2.length; l++) {
        for (let c = 0; c < this.map2[0].length; c++) {
            this.map2[l][c] = this.map[l][c];
            switch (this.map[l][c]) {
                case this.floorIndex: //Floor
                    break;
                case this.rockIndex: //Rock
                    if((l > 0 && l < this.map2.length - 1) && (c > 0 && c < this.map2[0].length - 1)){ //Certifica que walls nas laterais não serão removidos
                        if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) >= 1) {  //Celulas rock com 1 vizinho chão ou mais 
                            this.map2[l][c] = this.wallIndex;
                        }
                    }
                    else{
                        this.map2[l][c] = this.wallIndex;
                    }
                    break;
                case this.wallIndex: //Wall
                    break;
            }
        }
    }
}

/**
 * Autômato visado para limpar as walls em posições incorretas
 */

CellularAutomata.prototype.gameOfWallRulesAutomataFinalStepCleanWalls = function (){
    /**
    * Types:
    *   0 => floor;
    *   1 => rock;
    *   2 => wall;
    */
    let count = 0;
    for (let l = 0; l < this.map2.length; l++) {
        for (let c = 0; c < this.map2[0].length; c++) {
            this.map2[l][c] = this.map[l][c];
            if((l > 0 && l < this.map2.length - 1) && (c > 0 && c < this.map2[0].length - 1)){ //Certifica que walls nas laterais não serão removidos
                switch (this.map[l][c]) {
                    case this.floorIndex: //Floor
                        break;
                    case this.rockIndex: //Rock
                        break;
                    case this.wallIndex: //Wall
                        if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) >= 4 && this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) === 0) {
                            this.map2[l][c] = this.floorIndex;
                            count++;
                        }
                        else{
                            if(this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) === 0){
                                this.map2[l][c] = this.floorIndex;
                                count++;
                            }
                        }
                        break;
                }
            }
            else{
                switch (this.map[l][c]) {
                    case this.floorIndex: //Floor
                        break;
                    case this.rockIndex: //Rock
                        break;
                    case this.wallIndex: //Wall
                        if (this.countAdjacentsMoore(this.map, l, c, this.wallIndex, 1) >= 3) {
                            this.map2[l][c] = this.floorIndex;
                            count++;
                        }
                        /*else{
                            if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) === 0) {
                                this.map2[l][c] = this.rockIndex;
                                count++;
                            }
                        }*/
                        break;
                }
            }
        }
    }
    return count;
}

/**
 *
 * Remove as paredes em locais incorretos
 */

CellularAutomata.prototype.gameOfWallRulesAutomataRemoveWalls = function (){
    /**
    * Types:
    *   0 => floor;
    *   1 => rock;
    *   2 => wall;
    */
    for (let l = 0; l < this.map2.length; l++) {
        for (let c = 0; c < this.map2[0].length; c++) {
            this.map2[l][c] = this.map[l][c];
            switch (this.map[l][c]) {
                case this.floorIndex: //Floor
                    break;
                case this.rockIndex: //Rock
                    break;
                case this.wallIndex: //Wall
                    if (this.countAdjacentsMoore(this.map, l, c, this.rockIndex, 1) >= 3 && this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) ===  0) {  //Celulas rock com 1 vizinho chão ou mais 
                        this.map2[l][c] = this.rockIndex;
                    }
                    break;
            }
        }
    }
}

/**
 * Volta as matrizes do automato para um tipo padrão
 */

CellularAutomata.prototype.scenarioReset = function (tp){
    this.map  = this.initMap(this.HS, this.WS, tp);
    this.map2 = this.initMap(this.HS, this.WS, tp);
}

/**
 * Condição inicial do artigo: Randomiza walls em volta do mapa
 * e depois aplica os automatos
 */

CellularAutomata.prototype.scenarioRandomWall = function (){
    this.scenarioReset(this.floorIndex);          //Init with floor completely
    let matrix = [];
    for(let l = 0; l < this.HS; l++){
      for(let c = 0; c < this.WS; c++){
        matrix.push([l,c]);
      }
    }
    let rockInMap = (this.r * this.HS * this.WS)
    for(let i = 0; i < rockInMap; i++){
      let matrixIndexRandom = Math.floor(Math.random() * matrix.length);
      this.map[matrix[matrixIndexRandom][0]][matrix[matrixIndexRandom][1]] = this.rockIndex;
      this.map2[matrix[matrixIndexRandom][0]][matrix[matrixIndexRandom][1]] = this.rockIndex;
      matrix.splice(matrixIndexRandom, 1);
    }
}

