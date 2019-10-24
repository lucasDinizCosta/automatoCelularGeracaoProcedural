function Sprite(s = 16, typ = 0) {
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
  this.typeSprite = typ;
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
  if(debugMode === 0){
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


    /*if(this.vx === 0 && this.map.cell[this.gy][this.gx+1]!==0 && (this.x*this.s > (this.gx)*this.map.s)){
    console.log("FOI");
    var limite = (this.gx+1)*this.map.s;
    var maxDx = limite-(this.x+this.s/2);
    var Dx = this.vx*dt;
    this.x += Math.min(Dx, maxDx);
  }*/

  //Ponto central do sprite é o meio, logo compara com metade somente
  //Tem alguns bugs em entrar parte nos blocos não permitidos

  

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


  /*
  if(this.map.cell[this.gy][this.gx] === 5){    //Substitui o cenário já descoberto
    this.map.cell[this.gy][this.gx] = 0;
  }*/

  this.animationController();

};

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
    case 0:
      ctx.linewidth = 1;
      ctx.fillStyle = "rgba(10,10,10,0.4)";
      ctx.strokeStyle = "rgba(10,10,10,0.4)";
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.ellipse(-this.s/2+1, -this.s/4+2, this.s-2, this.s/2-2, 0, 0, 2*Math.PI, false);
      //ctx.ellipse(this.s/2, this.s/4, this.s, this.s/2, 0, 0, 2*Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      imageLibrary.drawClipSize(ctx, this.nomeImagem, 
        this.sizeImagem * (this.animationState % this.qtdAnimacoes), this.sizeImagem * this.pose, this.sizeImagem, this.sizeImagem, 
        -6-this.sizeImagem/2, 4-this.sizeImagem, this.sizeImagem, this.sizeImagem);
      ctx.restore();
      if(debugMode >= 1){
        this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCentro(ctx);
      }
      
      break;
    case 1:
      ctx.save();
      ctx.fillStyle = "blue";
      ctx.strokeStyle = "blue";
      ctx.linewidth = 10;
      ctx.globalAlpha = 0.70;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
    case 2:
      ctx.save();
      ctx.strokeStyle = "Yellow";
      ctx.fillStyle = "orange";
      ctx.linewidth = 10;
     // imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
      ctx.globalAlpha = 0.40;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
      break;
    case 3:                       //Inicio de fase
      ctx.save();
      ctx.fillStyle = "rgb(84, 46, 139)";
      ctx.strokeStyle = "purple";
      ctx.linewidth = 10;
      ctx.globalAlpha = 0.70;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
    case 4:                     //Final de fase
      ctx.save();
      ctx.strokeStyle = "dark green";
      ctx.fillStyle = "green";
      ctx.linewidth = 10;
      // imageLibrary.drawSize(ctx, "sandGround", c*this.s, l*this.s, this.s, this.s);
      ctx.globalAlpha = 0.40;         //Transparência
      ctx.translate(this.x, this.y);
      ctx.fillRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.strokeRect(-this.s/2, -this.s/2, this.s, this.s);
      ctx.restore();
      break;
    default:
      console.log("Sprite type is wrong!!!");
      break;
  }
};

Sprite.prototype.desenharCentro = function(ctx){
  ctx.fillStyle = "red";
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 1;
  ctx.fillRect(this.x, this.y, 1, 1);
  ctx.strokeRect(this.x-1, this.y-1, 2, 2);
}

Sprite.prototype.desenharTempo = function (ctx) {
  ctx.fillStyle = this.colorBG;
  ctx.strokeStyle = this.colorBorder;
  ctx.lineWidth = this.borderSize;
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.strokeRect(this.x, this.y, this.w, this.h);
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

Sprite.prototype.desenharCell = function(ctx){
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 1;
  ctx.strokeRect(this.gx * this.map.s, this.gy * this.map.s, this.map.s, this.map.s);
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
 * ColidiuCom possui o ponto central do sprite no centro
*/

Sprite.prototype.colidiuCom2 = function (alvo) {
  if(alvo.x + alvo.s/2 < this.x - this.s/2) return false;
  if(alvo.x > this.x + this.s/2) return false;
  if(alvo.y + alvo.s/2 < this.y - this.s/2) return false;
  if(alvo.y > this.y + this.s/2) return false;
  return true;
};
