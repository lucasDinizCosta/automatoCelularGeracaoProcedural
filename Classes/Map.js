function Map(w, h, s) {
  this.w = w;
  this.h = h;
  this.s = s;
  this.cell = [];
  for (let l = 0; l < h; l++) {
    this.cell[l] = [];
    for (let c = 0; c < w; c++) {
      this.cell[l][c] = { tipo: 0, room: -3, dist: 999, linha: l, coluna: c};
    }
  }
}

//Map.prototype = new Map();
Map.prototype.constructor = Map;

Map.prototype.copyDates = function (matrix) {           // Copia a matriz de geração procedural que contém apenas o tipo da celula
  //this.cell = JSON.parse(JSON.stringify(matrix)); //Copia matriz
  for (var l = 0; l < this.h; l++) {
    for (var c = 0; c < this.w; c++) {
      this.cell[l][c].tipo = matrix[l][c];
    }
  }
}

/**
 * Return a text with type of each cells on the map
 */
Map.prototype.getMatrixType = function(){
  let text = "map[ " + this.h + " ][ "+ this.w + " ] = {\n";
  for(let i = 0; i < this.h; i++){
    text += "[";
    for(let j = 0; j < this.w; j++){
      text += this.cell[i][j].tipo + ", ";
    }
    text += "]\n";
  }
  text += "\n}\n"
  return text;
}

Map.prototype.copyDataInto = function (matrix, L, C) {
  //console.log(matrix);
  //if(!this.cell) this.cell = [];
  for (var l = 0; l < matrix.length - 1; l++) {
    //this.cell[l] = [];
    for (var c = 0; c < matrix[0].length - 1; c++) {
      this.cell[l + L][c + C].tipo = matrix[l][c];
    }
  }
}

Map.prototype.initMap = function (L, C, v) {
  let mapx = [];
  for (let l = 0; l < L; l++) {
    mapx[l] = [];
    for (let c = 0; c < C; c++) {
      mapx[l][c] = v;
    }
  }
  return mapx;
}

Map.prototype.findCellByDistAndType = function(value, type, row, column){
  if(row != null && column != null){              // Começar a analisar de uma posicação específica
    for(let l = row; l < this.h; l++){
      for(let c = column; c < this.w; c++){
        if(this.cell[l][c].tipo == type){
          if(this.cell[l][c].dist >= value){
            return this.cell[l][c];
          }
        }
      }
    }
  }
  else{
    for(let l = 0; l < this.h; l++){
      for(let c = 0; c < this.w; c++){
        if(this.cell[l][c].tipo == type){
          if(this.cell[l][c].dist >= value){
            return this.cell[l][c];
          }
        }
      }
    }
  }
  return null;                // Não encontrou nenhuma celula com a caracteristica
}

Map.prototype.getCell = function(row, column){
  return this.cell[row][column];
}

// Caminha na matriz e encontra as salas que cada célula pertence
Map.prototype.mapearSalas = function () {
  let auxMatrix = this.initMap(this.h, this.w, -1);
  let auxMatrixVisited = [];
  let room = 0;
  let roomFloors = 0;
  let caveArea = 0;
  let floorIndex = 0;
  for (let i = 0; i < this.h; i++) {
    auxMatrixVisited[i] = [];
    for (let j = 0; j < this.w; j++) {
      auxMatrixVisited[i][j] = false;
      if (this.cell[i][j].tipo !== floorIndex) {
        auxMatrix[i][j] = -2;   //Cave area
        caveArea++;
      }
      else {
        auxMatrix[i][j] = -1;   //rooms area
        roomFloors++;
      }
    }
  }

  for (let i = 0; i < this.h; i++) {
    for (let j = 0; j < this.w; j++) {
      if (auxMatrix[i][j] === -1) {
        room++;
        this.visitCells(auxMatrix, this.cell, i, j, floorIndex, 1, room);
      }
    }
  }

  for (let i = 0; i < this.h; i++) {            //Ajusta os indices das salas de cada celula
    for (let j = 0; j < this.w; j++) {
      this.cell[i][j].room = auxMatrix[i][j];
    }
  }
}

Map.prototype.visitCells = function (auxMatrix, mapx, y, x, tp, d = 1, indexArea) {   //visita as celulas visinhas de maneira recursiva e atribui o código da sala correspondente 
  /**********************************************
   * 
   * Algoritmo Flood fill:
   * https://en.wikipedia.org/wiki/Flood_fill
   * 
  ***********************************************/

  if (auxMatrix[y][x] === indexArea) {  //Célula com a "cor" ou "indice da sala" correspondente ao indexArea
    return;
  }
  if (auxMatrix[y][x] === -1) {         //Não mapeado ainda
    auxMatrix[y][x] = indexArea;        //Set cell is visited
  }
  else {                                //Ou foi mapeado ou a celula é Wall/Rock
    return;
  }
  if (y - 1 >= 0) {
    this.visitCells(auxMatrix, mapx, y - 1, x, tp, d, indexArea);
  }
  if (y + 1 < this.h) {
    this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
  }
  if (x - 1 >= 0) {
    this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
  }
  if (x + 1 < this.w) {
    this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
  }
}

Map.prototype.desenhar = function (ctx) {
  ctx.lineWidth = 2;
  for (var l = Math.max(0, player.sprite.gy - MAPA_AREA); l < Math.min(this.h, player.sprite.gy + MAPA_AREA); l++) {
    for (var c = Math.max(0, player.sprite.gx - MAPA_AREA); c < Math.min(this.w, player.sprite.gx + MAPA_AREA); c++) {
      switch (this.cell[l][c].tipo) {
        case 0:   // Vazio     -- Chão
          assetsMng.drawSize(ctx, "floor_sand", c * this.s, l * this.s, this.s, this.s);
          break;
        case 1:   // Bloqueado -- Muro
          assetsMng.drawSize(ctx, "brick_gray", c * this.s, l * this.s, this.s, this.s);
          break;
        case 2:   // Local de saida
          ctx.strokeStyle = "darkBlue";
          ctx.fillStyle = "lightBlue";
          ctx.linewidth = 10;
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          break;
        case 3:   // local de chegada
          ctx.strokeStyle = "Yellow";
          ctx.fillStyle = "orange";
          ctx.linewidth = 10;
          assetsMng.drawSize(ctx, "floor_sand", c * this.s, l * this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
        case 4:   // Tesouro a pegar
          assetsMng.drawSize(ctx, "floor_sand", c * this.s, l * this.s, this.s, this.s);
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "grey";
          ctx.fillRect(c * this.s + this.s / 3, l * this.s + this.s / 3, this.s / 3, this.s / 3);
          ctx.strokeRect(c * this.s + this.s / 3, l * this.s + this.s / 3, this.s / 3, this.s / 3);
          break;
        case 5:   // Caverna
          assetsMng.drawClipSize(ctx, "rockBlock", 0, 0, 32, 32, c * this.s, l * this.s, this.s, this.s);
          break;
        case 6:   // areaSafe - Recuperar a energia
          ctx.strokeStyle = "Yellow";
          ctx.fillStyle = "orange";
          ctx.linewidth = 10;
          assetsMng.drawSize(ctx, "floor_sand", c * this.s, l * this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
          break;
        case 7:   // Teleporte
          ctx.strokeStyle = "darkGreen";
          ctx.fillStyle = "lightGreen";
          ctx.linewidth = 10;
          //assetsMng.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
          break;
        case 8:   //Bloco lento
          ctx.strokeStyle = "purple";
          ctx.fillStyle = "purple";
          ctx.linewidth = 10;
          //assetsMng.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.60;         //Transparência
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          ctx.restore();
          break;
        case 9:   //Bloqueio com espinho
          //assetsMng.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          //assetsMng.drawSize(ctx, "tijoloEspinho", c*this.s, l*this.s, this.s, this.s);
          break;
        case 10:  //Posição do inimigo    
          ctx.strokeStyle = "darkgrey";
          ctx.fillStyle = "grey";
          ctx.linewidth = 10;
          ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
          ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
          break;
        default:
          console.log("Wrong index map element");
          break;
      }

      if (debugMode === 3) {
        this.desenharCell(ctx, l, c);         //Debug mode Grid
      }
    }
  }
}

Map.prototype.desenharCentro = function (ctx) {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.fillRect(c * this.s, l * this.s, this.s, this.s);
  ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
}

Map.prototype.desenharCell = function (ctx, l, c) {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
  //if (this.cell[0][0].room !== -3) {        //Verificacao de celula não alocada pra uma sala
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "10px Arial Black";
    this.escreveTexto(ctx, this.cell[l][c].tipo + "", c * this.s + this.s / 2 - 10, l * this.s + this.s / 2);
    ctx.fillStyle = "green";
    this.escreveTexto(ctx, this.cell[l][c].room + "", c * this.s + this.s / 2 + 10, l * this.s + this.s / 2);
    ctx.fillStyle = "blue";
    this.escreveTexto(ctx, this.cell[l][c].dist + "", c * this.s + this.s / 2, l * this.s + this.s / 2 + 10);

  //}
};

Map.prototype.escreveTexto = function (ctx, texto, x, y) {
  ctx.strokeText(texto, x, y);
  ctx.fillText(texto, x, y);
}

// Matriz de distancias: Calcula a distancia em relação a uma linha, coluna e valor inicial
Map.prototype.atualizaDist = function (l, c, v) {
  let aavaliar = [{ l, c, v }];
  let cell;

  //console.log("Map.AtualizaDist:");

  while (cell = aavaliar.pop()) {

    if (cell.l < 0 || cell.l >= this.h || cell.c < 0 || cell.c >= this.w) {
      continue;
    }

    if (this.cell[cell.l][cell.c].tipo != 0) {
      continue;
    }
    if (this.cell[cell.l][cell.c].dist <= cell.v) {
      continue;
    }
    this.cell[cell.l][cell.c].dist = cell.v;
    aavaliar.push({l:cell.l - 1, c:cell.c, v:cell.v + 1});
    aavaliar.push({l:cell.l + 1, c:cell.c, v:cell.v + 1});
    aavaliar.push({l:cell.l, c:cell.c - 1, v:cell.v + 1});
    aavaliar.push({l:cell.l, c:cell.c + 1, v:cell.v + 1});
  }
}
