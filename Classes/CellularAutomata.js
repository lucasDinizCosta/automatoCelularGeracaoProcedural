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
}

CellularAutomata.prototype.fullstep = function(steps = 2){
    while(steps > 0){
        this.gameOfWallRulesAutomata();
        this.toggleMaps();
        steps--;
    }
    this.gameOfWallRulesAutomataFinalStep();
    this.toggleMaps();
    /*while(this.gameOfWallRulesAutomataFinalStepCleanWalls() !== 0){ //Limpa as paredes espaçadas
        this.toggleMaps();
    }*/
    
    this.gameOfWallRulesAutomataFinalStepCleanWalls();
    this.toggleMaps();
}

CellularAutomata.prototype.countRooms = function(){
    let auxMatrix = this.initMap(this.HS, this.WS, -1);
    let room = 1;
    for(let i = 0; i < this.HS; i++){
        for(let j = 0; j < this.WS; j++){
            if(this.map[i][j] !== this.floorIndex){
                auxMatrix[i][j] = -2;   //Cave area
            }
        }
    }
    for(let i = 0; i < this.HS; i++){
        for(let j = 0; j < this.WS; j++){
            if(auxMatrix[i][j] === -1){
                //auxMatrix[i][j] = -2;   //Cave area
                this.visitCells(auxMatrix, this.map, i, j, this.floorIndex, 1, room);
                room++;
            }
        }
    }
    console.log("Number of rooms: " + room);
    let text = "";
    for(let i = 0; i < this.HS; i++){
        text = text + "auxMatrix ["+i+"]: {";
        for(let j = 0; j < this.WS; j++){
            text = text + " " + auxMatrix[i][j] + "("+j+"), ";
        }
        text = text + " }\n"
    }
    console.log(text);
}

/*function visit(cell) {
    if cell.marked return;
    cell.marked = true;
    foreach neighbor in cell.neighbors {
        if cell.color == neighbor.color {
            visit(neighbor)
        }
    }
}*/

CellularAutomata.prototype.visitCells = function(auxMatrix, mapx, y, x, tp, d = 1, indexArea){   //Conta as células de um tipo específico ao redor da célula (x,y)
    if(auxMatrix[y][x] === indexArea){  //Cell is visited??
        return;
    }
    auxMatrix[y][x] = indexArea;    //Set cell is visited
    const mL = Math.max(y - d, 0);
    const ML = Math.min(y + d, mapx.length-1);
    const mC = Math.max(x - d, 0);
    const MC = Math.min(x + d, mapx[0].length-1);
    for (let l = mL; l <= ML; l++) {
        for (let c = mC; c <= MC; c++) {
            if(l !== y && c !== x){
                if (mapx[l][c] === tp) {
                    auxMatrix[l][c] = indexArea;
                    this.visitCells(auxMatrix, mapx, l, c, tp, d, indexArea);
                }
            }
        }
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
    //console.log(JSON.stringify(this.map2));
    this.map = JSON.parse(JSON.stringify(this.map2)); //Copia matriz
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

CellularAutomata.prototype.gameOfWallRulesAutomataFinalStep = function (){
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
                    if (this.countAdjacentsMoore(this.map, l, c, this.floorIndex, 1) >= 1) {  //Celulas rock com 1 vizinho chão ou mais 
                        this.map2[l][c] = this.wallIndex;
                    }
                    break;
                case this.wallIndex: //Wall
                    break;
            }
        }
    }
}

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
    }
    return count;
}

CellularAutomata.prototype.scenarioReset = function (tp){
    this.map  = this.initMap(this.HS, this.WS, tp);
    this.map2 = this.initMap(this.HS, this.WS, tp);
}

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