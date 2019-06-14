function Level(w,h,s) {
  this.mapa = new Map(w,h,s);
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
  this.inimigos = [];
  this.teleportes = [];
  this.itens = [];
};

Level.prototype.setTempo = function(tempo, larguraBarra){
  this.tempoFase = tempo;
  this.taxaDiminuicaoTempo = Math.floor(larguraBarra/tempo);
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
  this.inimigos.length = 0;
  this.teleportes.length = 0;
  this.itens.length = 0;
  for (var i = 0; i < level.inimigos.length; i++) {
    this.inimigos.push(level.inimigos[i]);
  }
  for (var i = 0; i < level.teleportes.length; i++) {
    this.teleportes.push(level.teleportes[i]);
  }
  for (var i = 0; i < level.itens.length; i++) {
    this.itens.push(level.itens[i]);
  }
}

Level.prototype.desenhar = function(ctx) {
  ctx.lineWidth = 2;
  for (var l = 0; l < this.mapa.h; l++) {
    for (var c = 0; c < this.mapa.w; c++) {
      if(this.mapa.cell[l][c] === 0){                  //Vazio
        //ctx.fillStyle = "black";
        //ctx.strokeStyle = "grey";
        //console.log(l*this.mapa.s);
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        //ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        //ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
      } else if(this.mapa.cell[l][c] === 1){          //Bloqueado
        //ctx.strokeStyle = "grey";
        imageLibrary.drawSize(ctx, "brickRed", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        //ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);
      } else if(this.mapa.cell[l][c] === 2){           //Local de saida
        ctx.strokeStyle = "darkBlue";
        ctx.fillStyle = "lightBlue";
        ctx.linewidth = 10;
        ctx.fillRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.strokeRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);

        //imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.s, l*this.s, this.s, this.s);
        /*ctx.fillStyle = "lightBlue";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.s, l*this.s, this.s, this.s);
        ctx.strokeRect(c*this.s, l*this.s, this.s, this.s);*/
      } else if(this.mapa.cell[l][c] === 3){          //local de chegada
        ctx.strokeStyle = "Yellow";
        ctx.fillStyle = "orange";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.save();
        if(this.tesouros != teasuresCollected){
          ctx.globalAlpha = 0.40;         //Transparência
        }
        //console.log(this.tesouros+"  "+teasuresCollected);
        ctx.fillRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.strokeRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.restore();
      } else if(this.mapa.cell[l][c] === 4){           //Tesouro a pegar
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.fillStyle = "yellow";
        ctx.strokeStyle = "grey";
        ctx.fillRect(c*this.mapa.s + this.mapa.s/3, l*this.mapa.s + this.mapa.s/3, this.mapa.s/3, this.mapa.s/3);
        ctx.strokeRect(c*this.mapa.s + this.mapa.s/3, l*this.mapa.s + this.mapa.s/3, this.mapa.s/3, this.mapa.s/3);
      } else if(this.mapa.cell[l][c] === 5){             //Terreno vazio
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80, c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
      } else if(this.mapa.cell[l][c] === 6){             //Terreno com mina
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        imageLibrary.drawClipSize(ctx, "sandBlock", 0, 0, 80, 80,c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
      } else if(this.mapa.cell[l][c] === 7){             //Teleporte
        ctx.strokeStyle = "darkGreen";
        ctx.fillStyle = "lightGreen";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.save();
        ctx.globalAlpha = 0.40;         //Transparência
        ctx.fillRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.strokeRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.restore();
      } else if(this.mapa.cell[l][c] === 8){             //Bloco lento
        ctx.strokeStyle = "purple";
        ctx.fillStyle = "purple";
        ctx.linewidth = 10;
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.save();
        ctx.globalAlpha = 0.60;         //Transparência
        ctx.fillRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.strokeRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.restore();
      } else if(this.mapa.cell[l][c] === 9){             //Bloqueio com espinho
        imageLibrary.drawSize(ctx, "sandGround", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        imageLibrary.drawSize(ctx, "tijoloEspinho", c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
      } else if(this.mapa.cell[l][c] === 10){             //Posição do inimigo
        ctx.strokeStyle = "darkgrey";
        ctx.fillStyle = "grey";
        ctx.linewidth = 10;
        ctx.fillRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
        ctx.strokeRect(c*this.mapa.s, l*this.mapa.s, this.mapa.s, this.mapa.s);
      }
    }
  }
};
