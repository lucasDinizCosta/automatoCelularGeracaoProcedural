function Enemy() {
    Sprite.call(this, {s: 22, w: 22, h: 10, nomeImagem: "slime", sizeImagem: 22});            
    this.roomNumber = -1;
    this.animation = [];
    this.qtdAnimacoes = {types: 2, lines: [0, 1], qtd: [9, 3]/* atacking: 9, normal: 3*/};
    this.speedAnimation = 1.2;
    this.type = 0;
    this.pose = 0;
    this.matrizImagem = {
        linha: 1,
        colunas: 9,
        widthImagem: 22,
        heightImagem: 22
    };
    this.criarAnimacoes();
}

// Heranca
Enemy.prototype = new Sprite();              // Define que o Enemy é um Sprite
Enemy.prototype.constructor = Enemy;

Enemy.prototype.mover = function (dt) {
    this.pose = this.pose + this.speedAnimation * dt;
}

Enemy.prototype.criarAnimacoes = function(){
    // Cria a lista de tipos de animações
    for(let i = 0; i < this.qtdAnimacoes.types; i++){
        let auxAnimation = {
            animationFrame: [],
            type: i,
            qtdFrames: this.qtdAnimacoes.qtd[i]
        }
        this.animation.push(auxAnimation);
    }

    for(let i = 0; i < this.animation.length; i++){             // Animações
        for(let j = 0; j < this.animation[i].qtdFrames; j++){   // Frames
            let animationFrame = {
                sizeImagem: this.s,
                pose: j,
                sx: 1 + 23 * j,
                sy: 1 + 23 * this.qtdAnimacoes.lines[i],
            };
            this.animation[i].animationFrame.push(animationFrame);
        }
    }
}

Enemy.prototype.desenhar = function(ctx){
    let elipse = {
        x: 0,
        y: 0,
        radiusX: this.sizeImagem/2 - 0.8,
        radiusY: this.sizeImagem/3 - 2.2,
        rotation: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
        anticlockwise: false
    }
    ctx.linewidth = 1;
    ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
    ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(elipse.x, elipse.y, elipse.radiusX, elipse.radiusY, elipse.rotation, elipse.startAngle, 
    elipse.endAngle, elipse.anticlockwise); //ctx.ellipse(-this.s/2 + 7, -this.s/4 + 6, this.s - 2, this.s/2 - 2, 0, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    assetsMng.drawClip({ctx: ctx, key: this.nomeImagem, 
        sx: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sx,
        sy: this.animation[this.type].animationFrame[Math.floor(this.pose) % this.animation[this.type].qtdFrames].sy,
        w: this.matrizImagem.widthImagem, h: 22, dx: -this.matrizImagem.widthImagem/2,  
        dy: -this.matrizImagem.heightImagem/2 - 8/*- this.matrizImagem.heightImagem/2*/
    });
    ctx.restore();
    if(debugMode == 1){
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        this.desenharCaixaColisao(ctx);
    }
}  