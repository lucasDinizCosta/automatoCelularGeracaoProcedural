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
    this.map = this.initMap(HS, WS, this.floorIndex);
    this.map2 = this.initMap(HS, WS, this.floorIndex);
}

CellularAutomata.prototype.fullstep = function(steps = 2){
    while(steps > 0){
        this.gameOfWallRulesAutomata();
        this.toggleMaps();
        steps--;
    }
    this.gameOfWallRulesAutomataFinalStep();
    this.toggleMaps();
}

CellularAutomata.prototype.countAdjacentsMoore = function(mapx, y, x, tp, d=1){ //Conta as células de um tipo específico ao redor da célula (x,y)
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


