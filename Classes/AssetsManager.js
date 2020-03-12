function AssetsManager() {
    this.aCarregar = 0;
    this.carregadas = 0;
    this.images = {};
    this.audios = {};
    this.channels = [];
    this.MAX_CHANNELS = 20;
    for(var i = 0; i< this.MAX_CHANNELS; i++){
        this.channels[i] = {
            audio: new Audio(),
            fim: -1
        };
    }
}

AssetsManager.prototype.loadImage = function (key, url) {
    console.log(`Carregando imagem ${url}...`);

    this.aCarregar++;
    var imagem = new Image();
    imagem.src = url;
    this.images[key] = imagem;
    var that = this;
    imagem.addEventListener("load", function () {
        that.carregadas++;
        console.log(`Imagem ${that.carregadas}/${that.aCarregar} ${key}: ${url} carregada.`);
    });
}

AssetsManager.prototype.img = function (key) {
    return this.images[key];
}

AssetsManager.prototype.progresso = function () {
    if (this.aCarregar != 0) {
        return this.carregadas / this.aCarregar * 100.0;
    } else return 0.0;
}

AssetsManager.prototype.loadAudio = function (key, url) {
    console.log(`Carregando audio ${key}: ${url}...`);
    //this.aCarregar++;
    var audio = new Audio();
    audio.src = url;
    audio.load();
    this.audios[key] = audio;
    var that = this;
    /*audio.addEventListener("canplay", function () {
        //that.carregadas++;
        console.log(`Audio ${that.carregadas}/${that.aCarregar} ${key}: ${url} carregado.`);
    });
    */
}

/****************************************************************************
 *               FUNÇÕES DE CONTROLE DE AUDIO AUXILIARES:                   *
 ****************************************************************************/

AssetsManager.prototype.play = function (key) {
    if(!this.audios[key]){
        throw new Error(`Chave de audio inválida: ${key}!`);
    }
    for(let i = 0; i< this.MAX_CHANNELS; i++){
        let agora = new Date();
        if(this.channels[i].fim < agora.getTime()){
            this.channels[i].audio.src = this.audios[key].src;
            this.channels[i].fim = agora.getTime()+this.audios[key].duration*1000;
            this.channels[i].audio.play();
            break;
        }

    }
}

AssetsManager.prototype.pause = function (key) {
    for (var i = 0; i < this.channels.length; i++) {
      var canal = this.channels[i];
      if(canal.audio.src == this.audios[key].src){
        canal.audio.pause();
        //console.log("Pausou: "+ canal.audio.currentTime);
        break;
      }
    }
  };
  
  AssetsManager.prototype.resume = function (key) {
    for (var i = 0; i < this.channels.length; i++) {
      var canal = this.channels[i];
      if(canal.audio.src == this.audios[key].src){
        canal.audio.play();
        //console.log("Voltou: "+ canal.audio.currentTime);
        break;
      }
    }
  };
  
  AssetsManager.prototype.isPaused = function (key) {         //retorna se o audio está pausado
    for (var i = 0; i < this.channels.length; i++) {
      var canal = this.channels[i];
      if(canal.audio.src == this.audios[key].src){
        if(canal.audio.paused){
          return true;
        }
        return false;
      }
    }
    return true;                                            //Audio não foi iniciado
  };
  
  AssetsManager.prototype.stop = function (key) {            //parar de executar o áudio removendo do canal
    for (var i = 0; i < this.channels.length; i++) {
      if(this.channels[i].audio.src == this.audios[key].src){
        this.channels[i].audio.pause();
        this.channels[i] = {
          audio: new Audio(),
          fim: -1
        };
        break;
      }
    }
    return true;                                          //Audio não foi iniciado
  };
  
  AssetsManager.prototype.isEnded = function (key) {       //Se o audio terminou de ser executado
    for (var i = 0; i < this.channels.length; i++) {
      var canal = this.channels[i];
      if(canal.audio.src == this.audios[key].src){
        if(canal.audio.ended){
          return true;
        }
        return false;
      }
    }
    return true;                                            //Audio não foi iniciado
  };
  
  AssetsManager.prototype.isPlaying = function(key){
    if(this.currentTime(key) > 0 && this.currentTime(key) < this.duration(key)){
      return true;
    }
    return false;
  }
  
  AssetsManager.prototype.duration = function (key) {         //Tempo de duração do audio
    return this.audios[key].duration;
  };
  
  AssetsManager.prototype.currentTime = function (key) {      //tempo até onde o audio foi executado
    for (var i = 0; i < this.channels.length; i++) {
      if(this.channels[i].audio.src == this.audios[key].src){
        return this.channels[i].audio.currentTime;
      }
    }
  };

/****************************************************************************
 *                      FUNÇÕES DE DESENHO AUXILIARES:                      *
 ****************************************************************************/

/**
 *  Desenha a imagem toda em seu tamanho padrão
 */

AssetsManager.prototype.draw = function (ctx, key, x, y) {
    ctx.drawImage(this.images[key], x, y);
};

/**
 *  Desenha a imagem toda com um altura e largura definidos
 */

AssetsManager.prototype.drawSize = function (ctx, key, x, y, w, h) {
    ctx.drawImage(this.images[key], x, y, w, h);
};

/**
 *  Desenha a imagem toda com uma angulação determinada
 */

AssetsManager.prototype.drawAngle = function(ctx, key, x, y, ang){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang * Math.PI/180);
    ctx.drawImage(this.images[key], -this.images[key].width/2, -this.images[key].height/2);
    ctx.restore();
}

/**
 *  Desenha uma parte da imagem mantendo a mesma proporção na tela
 */

AssetsManager.prototype.drawClip = function(ctx, key, sx, sy, w, h, dx, dy){
    ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, w, h);
}

/**
 *  Desenha parte da imagem e define a largura e altura que será desenhados na tela
 */

AssetsManager.prototype.drawClipSize = function(ctx, key, sx, sy, w, h, dx, dy, dw, dh){
    //sx, sy, w, h dentro da imagem - w e h são para a parte da imagem que irá pegar
    //dx, dy, dw, dh onde irá desenhar e em que proporção
    ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, dw, dh);
}

/**
 *  Desenha parte da imagem e uma angulação é atribuida
 */

AssetsManager.prototype.drawClipAngle = function(ctx, key, sx, sy, w, h, dx, dy, ang){
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(ang * Math.PI/180);
    ctx.drawImage(this.images[key], sx, sy, w, h, -w/2, -h/2, w, h);
    ctx.restore();
}

/**
 *  Desenha parte da imagem, com altura, largura e angulação definidos
 */
AssetsManager.prototype.drawClipSizeAngle = function(ctx, key, sx, sy, w, h, dx, dy, dw, dh, ang){
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(ang * Math.PI/180);
    ctx.drawImage(this.images[key], sx, sy, w, h, -w/2, -h/2, dw, dh);
    ctx.restore();
}