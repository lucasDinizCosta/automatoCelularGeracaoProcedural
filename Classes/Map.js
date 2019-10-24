function Map(w,h,s){
  this.w = w;
  this.h = h;
  this.s = s;
  this.cell = [];
  for (let l = 0; l < h; l++) {
    this.cell[l] = [];
    for (let c = 0; c < w; c++) {
      this.cell[l][c] = {tipo: 0, room:-3, dist:999};
    }
  }
  this.greedRooms = [];
}

//Map.prototype = new Map();
Map.prototype.constructor = Map;

Map.prototype.copyDates = function (matrix){
  //this.cell = JSON.parse(JSON.stringify(matrix)); //Copia matriz
  for (var l = 0; l < this.h; l++) {
    for (var c = 0; c < this.w; c++) {
      this.cell[l][c].tipo = matrix[l][c];
    }
  }
}

Map.prototype.copyDataInto = function (matrix, L, C){ 
  //console.log(matrix);
  //if(!this.cell) this.cell = [];
  for(var l = 0; l<matrix.length-1; l++){
    //this.cell[l] = [];
    for(var c = 0; c<matrix[0].length-1; c++){
      this.cell[l+L][c+C].tipo = matrix[l][c];
    }
  }
}

Map.prototype.initMap = function(L, C, v) {
  let mapx = [];
  for (let l = 0; l < L; l++) {
      mapx[l] = [];
      for (let c = 0; c < C; c++) {
          mapx[l][c] = v;
      }
  }
  return mapx;
}

Map.prototype.geraGradeSalas = function(){
  let auxMatrix = this.initMap(this.h, this.w, -1);
  let auxMatrixVisited = [];
  let room = 0;
  let roomFloors = 0;
  let caveArea = 0;
  let floorIndex = 0;
  for(let i = 0; i < this.h; i++){
      auxMatrixVisited[i] = [];
      for(let j = 0; j < this.w; j++){
          auxMatrixVisited[i][j] = false;
          if(this.cell[i][j].tipo !== floorIndex){
              auxMatrix[i][j] = -2;   //Cave area
              caveArea++;
          }
          else{
              auxMatrix[i][j] = -1;   //rooms area
              roomFloors++;
          }
      }
  }
  
  for(let i = 0; i < this.h; i++){
      for(let j = 0; j < this.w; j++){
          if(auxMatrix[i][j] === -1){
              room++;
              this.visitCells(auxMatrix, this.cell, i, j, floorIndex, 1, room);
          }
      }
  }
  this.greedRooms = JSON.parse(JSON.stringify(auxMatrix)); //Copia matriz
  for(let i = 0; i < this.h; i++){
    for(let j = 0; j < this.w; j++){
        this.cell[i][j].room = auxMatrix[i][j];
    }
  }
  console.log(this.cell);
  return auxMatrix;
}

Map.prototype.visitCells = function(auxMatrix, mapx, y, x, tp, d = 1, indexArea){   //visita as celulas visinhas de maneira recursiva e atribui o código da sala correspondente 
  /**********************************************
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
  if(y + 1 < this.h){
      this.visitCells(auxMatrix, mapx, y + 1, x, tp, d, indexArea);
  }
  if(x - 1 >= 0){
      this.visitCells(auxMatrix, mapx, y, x - 1, tp, d, indexArea);
  }
  if(x + 1 < this.w){
      this.visitCells(auxMatrix, mapx, y, x + 1, tp, d, indexArea);
  }
}

Map.prototype.desenhar = function (ctx) {
  ctx.lineWidth = 2;
  for (var l = Math.max(0,player.sprite.gy-MAPA_AREA); l < Math.min(this.h, player.sprite.gy+MAPA_AREA); l++) {
    for (var c = Math.max(0,player.sprite.gx-MAPA_AREA); c < Math.min(this.w, player.sprite.gx+MAPA_AREA); c++) {
      switch(this.cell[l][c].tipo){
        case 0:   //Vazio
          imageLibrary.drawSize(ctx, "floor_sand", c*this.s, l*this.s, this.s, this.s);
          break;
        case 1:   //Bloqueado
          imageLibrary.drawSize(ctx, "brick_gray", c*this.s, l*this.s, this.s, this.s);
          break;
        case 2:   //Local de saida
          ctx.strokeStyle = "darkBlue";
          ctx.fillStyle = "lightBlue";
          ctx.linewidth = 10;
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          break;
        case 3:   //local de chegada
          ctx.strokeStyle = "Yellow";
          ctx.fillStyle = "orange";
          ctx.linewidth = 10;
          imageLibrary.drawSize(ctx, "floor_sand", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          ctx.restore();
        case 4:   //Tesouro a pegar
          imageLibrary.drawSize(ctx, "floor_sand", c*this.s, l*this.s, this.s, this.s);
          ctx.fillStyle = "yellow";
          ctx.strokeStyle = "grey";
          ctx.fillRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
          ctx.strokeRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
          break;
        case 5:   //Terreno vazio
          //imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          imageLibrary.drawClipSize(ctx, "rockBlock", 0, 0, 32, 32, c*this.s, l*this.s, this.s, this.s);
          break;
        case 6:   //Terreno com mina
          //imageLibrary.dawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          //imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
          break;
        case 7:   //Teleporte
          ctx.strokeStyle = "darkGreen";
          ctx.fillStyle = "lightGreen";
          ctx.linewidth = 10;
          //imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          ctx.restore();
          break;
        case 8:   //Bloco lento
          ctx.strokeStyle = "purple";
          ctx.fillStyle = "purple";
          ctx.linewidth = 10;
          //imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.60;         //Transparência
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          ctx.restore();
          break;
        case 9:   //Bloqueio com espinho
          //imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          //imageLibrary.drawSize(ctx, "tijoloEspinho", c*this.s, l*this.s, this.s, this.s);
          break;
        case 10:  //Posição do inimigo    
          ctx.strokeStyle = "darkgrey";
          ctx.fillStyle = "grey";
          ctx.linewidth = 10;
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          break;
        default:
          console.log("Wrong index map element");
          break;
      }

      if(debugMode === 2){
        this.desenharCell(ctx, l, c);         //Debug mode Grid
      }
    }
  }
}

Map.prototype.desenharCentro = function(ctx){
  ctx.fillStyle = "red";
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
  ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
}

Map.prototype.desenharCell = function(ctx, l, c){
  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;
  ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
  if(this.cell[0][0].room !== -3){
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "10px Arial Black";
    this.escreveTexto(ctx, this.cell[l][c].tipo + "", c*this.s + this.s/2-10, l*this.s + this.s/2);
    ctx.fillStyle = "green";
    this.escreveTexto(ctx, this.cell[l][c].room + "", c*this.s + this.s/2+10, l*this.s + this.s/2);
    ctx.fillStyle = "blue";
    this.escreveTexto(ctx, this.cell[l][c].dist + "", c*this.s + this.s/2, l*this.s + this.s/2+10);

  }
  /*if(this.greedRooms.length > 0){
    //ctx.fillStyle = "rgb(" + (35 + (this.greedRooms[l][c] * 24))+ ", " + 143 + (this.greedRooms[l][c] * 10) + ", " + (81 + (this.greedRooms[l][c] * 24)) +")";
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "12px Arial Black";
    ctx.strokeText(this.greedRooms[l][c] + "", c*this.s + this.s/2, l*this.s + this.s/2);
    ctx.fillText(this.greedRooms[l][c] + "", c*this.s + this.s/2, l*this.s + this.s/2);
  }*/
};

Map.prototype.escreveTexto = function(ctx, texto, x, y){
  ctx.strokeText(texto, x, y);
  ctx.fillText(texto, x, y);
}
  