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

AssetsManager.prototype.play = function (key) {
    if(!this.audios[key]){
        throw new Error(`Chave de audio inválida: ${key}!`);
    }
    for(var i =0; i< this.MAX_CHANNELS; i++){
        var agora = new Date();
        if(this.channels[i].fim < agora.getTime()){
            this.channels[i].audio.src = this.audios[key].src;
            this.channels[i].fim = agora.getTime()+this.audios[key].duration*1000;
            this.channels[i].audio.play();
            break;
        }

    }
}

/**
 * FUNÇÕES DE DESENHOS AUXILIARES:
 */

AssetsManager.prototype.draw = function (ctx, key, x, y) {
    ctx.drawImage(this.images[key], x, y);
};

AssetsManager.prototype.drawSize = function (ctx, key, x, y, w, h) {
    ctx.drawImage(this.images[key], x, y, w, h);
};

AssetsManager.prototype.drawAngle = function(ctx, key, x, y, ang){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang * Math.PI/180);
    ctx.drawImage(this.images[key], -this.images[key].width/2, -this.images[key].height/2);
    ctx.restore();
}

AssetsManager.prototype.drawClip = function(ctx, key, sx, sy, w, h, dx, dy){
    ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, w, h);
}

AssetsManager.prototype.drawClipSize = function(ctx, key, sx, sy, w, h, dx, dy, dw, dh){
    //sx, sy, w, h dentro da imagem - w e h são para a parte da imagem que irá pegar
    //dx, dy, dw, dh onde irá desenhar e em que proporção
    ctx.drawImage(this.images[key], sx, sy, w, h, dx, dy, dw, dh);
}

AssetsManager.prototype.drawClipAngle = function(ctx, key, sx, sy, w, h, dx, dy, ang){
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(ang * Math.PI/180);
    ctx.drawImage(this.images[key], sx, sy, w, h, -w/2, -h/2, w, h);
    ctx.restore();
}