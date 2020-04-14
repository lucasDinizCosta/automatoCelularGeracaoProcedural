function Sprite(s = 16) {
  //Atibutos da Fisica
  this.x = 0;
  this.vx = 0;
  this.y = 0;
  this.vy = 0;
  this.w = 0;
  this.h = 0;

  //Atributos de grade
  this.gx = 0;
  this.gy = 0;
  this.s = s;
  this.map;

  //Atributos da imagem
  this.nomeImagem = "";
  this.wImagem = 0;
  this.hImagem = 0;
  this.sx = 0;
  this.sy = 0;
  this.sizeImagem = this.s;
  this.wImagem = this.s;
  this.hImagem = this.s;
  this.pose = 0;
  this.qtdAnimacoes = 0;
  this.animationState = 0;
  this.frameTimeAnimation = 12;
  this.speedAnimation = 160;
  this.typeAnimation = 0;     //0 => Walking, 1 => Atacking

  this.colorBG;
  this.colorBorder;
  this.borderSize = 1;
};

Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.mover = function (dt) {
  this.gx = Math.floor(this.x/this.map.s);
  this.gy = Math.floor(this.y/this.map.s);
  //console.log(this.gx + " -> gx, " + this.gy + " -> gy");

  /****************************************************************
  * Outro meio de andar nesse caso é utilizando a propria grade***
  *****************************************************************/

  /*
    this.x = this.gx*this.map.s + this.s;       //Andando por grade
    this.y = this.gy*this.map.s + this.s;
  */
  if(debugMode === 0 || debugMode === 2){
    if(this.gx === 0 || this.gx === (this.map.w - 1))  //Trata casos extremos do mapa =>{gx <= 0, gx >= gxMapa}
    {
      if(this.gx === 0){
        if(this.vx < 0){
          var limite = (this.gx)*this.map.s;
          var maxDx = limite-(this.x-this.s/2);
          var Dx = this.vx*dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0 && this.map.cell[this.gy][this.gx+1].tipo===1){
          var limite = (this.gx+1)*this.map.s;
          var maxDx = limite-(this.x+this.s/2);
          var Dx = this.vx*dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx*dt;
        }
      }
      else{
        if(this.vx < 0 && this.map.cell[this.gy][this.gx-1].tipo===1){
          var limite = (this.gx)*this.map.s;
          var maxDx = limite-(this.x-this.s/2);
          var Dx = this.vx*dt;
          this.x += Math.max(Dx, maxDx);
        } else if( this.vx > 0){
          var limite = (this.gx+1)*this.map.s;
          var maxDx = limite-(this.x+this.s/2);
          var Dx = this.vx*dt;
          this.x += Math.min(Dx, maxDx);
        }else {
          this.x += this.vx*dt;
        }
      }
    }
    else{
      if(this.vx < 0 && this.map.cell[this.gy][this.gx-1].tipo===1){
        var limite = (this.gx)*this.map.s;
        var maxDx = limite-(this.x-this.s/2);
        var Dx = this.vx*dt;
        this.x += Math.max(Dx, maxDx);
      } else if( this.vx > 0 && this.map.cell[this.gy][this.gx+1].tipo===1){
        var limite = (this.gx+1)*this.map.s;
        var maxDx = limite-(this.x+this.s/2);
        var Dx = this.vx*dt;
        this.x += Math.min(Dx, maxDx);
      }else {
        this.x += this.vx*dt;
      }
    }

    if(this.gy === 0 || this.gy === (this.map.h - 1))  //Trata casos extremos do mapa =>{gy <= 0, gy >= gyMapa}
    {
      if(this.gy === 0){
        if(this.vy < 0){
          var limite = (this.gy)*this.map.s;
          var maxDy = limite-(this.y-this.s/2);
          var Dy = (this.vy)*dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) >0 && this.map.cell[this.gy+1][this.gx].tipo!==0){
          var limite = (this.gy+1)*this.map.s;
          var maxDy = limite-(this.y+this.s/2);
          var Dy = (this.vy)*dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy)*dt;
        }
      }
      else{
        if((this.vy)<0 && this.map.cell[this.gy-1][this.gx].tipo!==0){
          var limite = (this.gy)*this.map.s;
          var maxDy = limite-(this.y-this.s/2);
          var Dy = (this.vy)*dt;
          this.y += Math.max(Dy, maxDy);
        } else if((this.vy) > 0){
          var limite = (this.gy+1)*this.map.s;
          var maxDy = limite-(this.y+this.s/2);
          var Dy = (this.vy)*dt;
          this.y += Math.min(Dy, maxDy);
        }else {
          this.y += (this.vy)*dt;
        }
      }
    }
    else{
      if((this.vy) < 0 && this.map.cell[this.gy-1][this.gx].tipo!==0){
        var limite = (this.gy)*this.map.s;
        var maxDy = limite-(this.y-this.s/2);
        var Dy = (this.vy)*dt;
        this.y += Math.max(Dy, maxDy);
      } else if((this.vy) >0 && this.map.cell[this.gy+1][this.gx].tipo!==0){
        var limite = (this.gy+1)*this.map.s;
        var maxDy = limite-(this.y+this.s/2);
        var Dy = (this.vy)*dt;
        this.y += Math.min(Dy, maxDy);
      }else {
        this.y += (this.vy)*dt;
      }
    }
  }
  else{ //Debug mode => Colision is not detected
    this.x += (this.vx)*dt;
    this.y += (this.vy)*dt;
  }

  this.animationController();
};

Sprite.prototype.mover2 = function(dt){
  this.gx = Math.floor(this.x/this.map.s);
  this.gy = Math.floor(this.y/this.map.s);

  if(debugMode == 0){
    this.adicionaRestricaoMovimento(dt);
  }
  else{
    this.x += (this.vx)*dt;
    this.y += (this.vy)*dt;
  }

  this.animationController();
}

Sprite.prototype.adicionaRestricaoMovimento = function(dt){
  let dnx;
  let dx;
  dx = this.vx * dt;
  dnx = dx;
  dy = this.vy * dt;
  dny = dy;
  if (dx > 0 && this.map.cell[this.gy][this.gx + 1].tipo != 0) {
      dnx = this.map.s * (this.gx + 1) - (this.x + this.w / 2);
      dx = Math.min(dnx, dx);
  }
  if (dx < 0 && this.map.cell[this.gy][this.gx - 1].tipo != 0) {
      dnx = this.map.s * (this.gx - 1 + 1) - (this.x - this.w / 2);
      dx = Math.max(dnx, dx);
  }
  if (dy > 0 && this.map.cell[this.gy + 1][this.gx].tipo != 0) {
      dny = this.map.s * (this.gy + 1) - (this.y + this.h / 2);
      dy = Math.min(dny, dy);
  }
  if (dy < 0 && this.map.cell[this.gy - 1][this.gx].tipo != 0) {
      dny = this.map.s * (this.gy - 1 + 1) - (this.y - this.h / 2);
      dy = Math.max(dny, dy);
  }
  this.vy = dy / dt;
  this.x = this.x + dx;
  this.y = this.y + dy;

  var MAXX = this.map.s * this.map.c - this.w / 2;
  var MAXY = this.map.s * this.map.l - this.h / 2;

  if (this.x > MAXX) this.x = MAXX;
  if (this.y > MAXY) {
      this.y = MAXY;
      this.vy = 0;
  }
  if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
  if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;
}

Sprite.prototype.animationController = function(){
  if(this.typeAnimation == 0){
    if(this.vx !== 0 || this.vy !== 0){
      this.frameTimeAnimation = this.frameTimeAnimation - this.speedAnimation*dt;
      if(this.frameTimeAnimation < 0){
        this.frameTimeAnimation = 12;
        this.animationState = this.animationState + 1;
      }
    }
    else{
      this.frameTimeAnimation = 12;
      this.animationState = 0;
    }
  }
  else{
    this.frameTimeAnimation = this.frameTimeAnimation - this.speedAnimation*dt;
    if(this.frameTimeAnimation < 0){
      this.frameTimeAnimation = 12;
      this.animationState = this.animationState + 1;
    }
  }
}

Sprite.prototype.copy = function(sprite){
  //Atibutos da Fisica
  this.x = sprite.x;
  this.vx = sprite.vx;
  this.y = sprite.y;
  this.vy = sprite.vy;
  this.w = sprite.w;
  this.h = sprite.h;

  //Atributos de grade
  this.gx = sprite.gx;
  this.gy = sprite.gy;
  this.s = sprite.s;
  this.map = sprite.map;

  //Atributos da imagem
  this.wImagem = sprite.wImagem;
  this.hImagem = sprite.hImagem;
  this.sx = sprite.sx;
  this.sy = sprite.sy;

  this.colorBG = sprite.colorBG;
  this.colorBorder = sprite.colorBorder;
  this.borderSize = sprite.borderSize;
  this.typeSprite = sprite.typeSprite;
}

Sprite.prototype.desenhar = function (ctx) {
  switch(this.typeSprite){
    case 5:                     //Area safe --- FireZones
      ctx.save();
      ctx.strokeStyle = "yellow";
      ctx.fillStyle = "red";
      ctx.linewidth = 2;
      ctx.globalAlpha = 0.20;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.ellipse(0, 0 ,this.s*0.7, this.s*0.7, 0,0, Math.PI*2, false);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1.00;         //Transparência
      assetsMng.drawClip(ctx, "flames", Math.floor(this.pose)*16, 0, 16, 24, -8, -12, 16, 24);
      ctx.restore();
      if(debugMode == 1){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCentro(ctx);
      }
      else if(debugMode == 2){
        //this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCaixaColisao(ctx);
      }
      break;
    default:
      console.log("Sprite type is wrong!!!");
      break;
  }
};

Sprite.prototype.desenharCentro = function(ctx){
  ctx.fillStyle = "blue";
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.fillRect(this.x-1, this.y-1, 3, 3);
  ctx.fillStyle = "red";
  ctx.fillRect(this.x, this.y, 1, 1);
}

Sprite.prototype.desenharCaixaColisao = function(ctx){
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillRect(- this.s/2,- this.s/2, this.s, this.s);
  ctx.strokeRect(- this.s/2, - this.s/2, this.s, this.s);
  ctx.restore();
}

Sprite.prototype.desenharTempo = function (ctx) {
  ctx.fillStyle = this.colorBG;
  ctx.strokeStyle = this.colorBorder;
  ctx.lineWidth = this.borderSize;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.strokeRect(this.x, this.y, this.w, this.h);
};

Sprite.prototype.desenharCell = function(ctx){
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 1;
  ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
};

Sprite.prototype.impoeLimites = function(x, y, w, h){
  if(this.x + this.w < x){
    this.x = x;
    this.vx = 0;
  }
  if(this.x + this.w > x + w){
    this.x = x + w - this.w;
    this.vx = 0;
  }
  if(this.y < y){
    this.y = y;
    this.vy = 0;
  }
  if(this.y + this.h > y + h){
    this.y = y + h - this.h;
    this.vy = 0;
  }
};

/** 
 * ColidiuCom possui o ponto central do sprite no canto superior esquerdo
*/

Sprite.prototype.colidiuCom = function (alvo) {
  if(alvo.x + alvo.w < this.x) return false;
  if(alvo.x > this.x + this.w) return false;
  if(alvo.y + alvo.h < this.y) return false;
  if(alvo.y > this.y + this.h) return false;
  return true;
};

/** 
 * ColidiuCom2s possui o ponto central do sprite no centro
*/

Sprite.prototype.colidiuCom2 = function (alvo) {
  if(alvo.x + alvo.s/2 < this.x - this.s/2) return false;
  if(alvo.x > this.x + this.s/2) return false;
  if(alvo.y + alvo.s/2 < this.y - this.s/2) return false;
  if(alvo.y > this.y + this.s/2) return false;
  return true;
};
