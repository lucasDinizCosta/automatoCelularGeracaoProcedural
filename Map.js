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

Map.prototype.desenhar = function (ctx) {
  ctx.lineWidth = 2;
  for (var l = 0; l < this.h; l++) {
    for (var c = 0; c < this.w; c++) {
      if(this.cell[l][c] === 0){                  //Vazio
        //ctx.fillStyle = "black";
        //ctx.strokeStyle = "grey";
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        //ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        //ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 1){          //Bloqueado
        //ctx.strokeStyle = "grey";
        imageLibrary.drawSize(ctx, "brickRed", c*this.s, l*this.s, this.s, this.s);
        //ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 2){           //Local de saida

        ctx.strokeStyle = "darkBlue";
        ctx.fillStyle = "lightBlue";
        ctx.linewidth = 10;
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);

        //imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
        /*ctx.fillStyle = "lightBlue";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);*/
      } else if(this.cell[l][c] === 3){          //local de chegada
        ctx.strokeStyle = "Yellow";
        ctx.fillStyle = "orange";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        ctx.save();
        ctx.globalAlpha = 0.40;         //Transparência
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
        ctx.restore();
        //imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
        /*ctx.fillStyle = "darkgrey";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
        ctx.strokeRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
        ctx.fillStyle = "lightBlue";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);*/
        //imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 4){           //Tesouro a pegar
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
        ctx.strokeRect(c*this.s + this.s/3, l*this.s + this.s/3, this.s/3, this.s/3);
      } else if(this.cell[l][c] === 5){             //Terreno vazio
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 6){             //Terreno com mina
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 7){             //Teleporte
        ctx.strokeStyle = "darkGreen";
        ctx.fillStyle = "lightGreen";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        ctx.save();
        ctx.globalAlpha = 0.40;         //Transparência
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
        ctx.restore();
      } else if(this.cell[l][c] === 8){             //Bloco lento
        ctx.strokeStyle = "purple";
        ctx.fillStyle = "purple";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        ctx.save();
        ctx.globalAlpha = 0.60;         //Transparência
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
        ctx.restore();
      } else if(this.cell[l][c] === 9){             //Bloqueio com espinho
        imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
        imageLibrary.drawSize(ctx, "tijoloEspinho", c*this.s, l*this.s, this.s, this.s);
      } else if(this.cell[l][c] === 10){             //Posição do inimigo
        ctx.strokeStyle = "darkgrey";
        ctx.fillStyle = "grey";
        ctx.linewidth = 10;
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
      }
    }
  }
};

/*var MAPA1 = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,1,1],
  [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,1,1],
  [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];*/
