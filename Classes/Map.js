function Map(w,h,s){
  this.w = w;
  this.h = h;
  this.s = s;
  this.cell = [];
  for (var l = 0; l < h; l++) {
    this.cell[l] = [];
    for (var c = 0; c < w; c++) {
      this.cell[l][c] = 0;
    }
  }
}

//Map.prototype = new Map();
Map.prototype.constructor = Map;

Map.prototype.copyDates = function (matrix){
  this.cell = JSON.parse(JSON.stringify(matrix)); //Copia matriz
}

Map.prototype.copyDataInto = function (matrix, L, C){ 
  console.log(matrix);
  //if(!this.cell) this.cell = [];
  for(var l = 0; l<matrix.length-1; l++){
    //this.cell[l] = [];
    for(var c = 0; c<matrix[0].length-1; c++){
      this.cell[l+L][c+C] = matrix[l][c];
    }
  }
}

Map.prototype.desenhar = function (ctx) {
  ctx.lineWidth = 2;
  for (var l = Math.max(0,player.sprite.gy-MAPA_AREA); l < Math.min(this.h, player.sprite.gy+MAPA_AREA); l++) {
    for (var c = Math.max(0,player.sprite.gx-MAPA_AREA); c < Math.min(this.w, player.sprite.gx+MAPA_AREA); c++) {
      switch(this.cell[l][c]){
        case 0:   //Vazio
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          break;
        case 1:   //Bloqueado
          imageLibrary.drawSize(ctx, "brickRed", c*this.s, l*this.s, this.s, this.s);
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
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.40;         //Transparência
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          ctx.restore();
        case 4:   //Tesouro a pegar
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
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
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
          break;
        case 7:   //Teleporte
          ctx.strokeStyle = "darkGreen";
          ctx.fillStyle = "lightGreen";
          ctx.linewidth = 10;
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
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
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          ctx.save();
          ctx.globalAlpha = 0.60;         //Transparência
          ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
          ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
          ctx.restore();
          break;
        case 9:   //Bloqueio com espinho
          imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
          imageLibrary.drawSize(ctx, "tijoloEspinho", c*this.s, l*this.s, this.s, this.s);
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
    }
  }
}