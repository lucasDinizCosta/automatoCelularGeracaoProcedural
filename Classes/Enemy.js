function Enemy(size, nomeImagem) {
    /**
     * Estabelece a relação de Herança entre Player e Sprite:
     *  -> Sprite é pai e player é filho
     */
    Sprite.call(this, size);            

    //this.sprite = new Sprite(size, 0);
    this.timeWalkSound = 0.5;
    this.levelNumber = 1;

    //AnimationStates
    this.sentidoMovimento = 0;          //0 => direita, 1 => baixo, 2 => esquerda, 3 => cima
    this.atacando = 0;                  //0 => Não, 1 => Sim
    this.estadoAnimacaoAtual = 3;
    this.poseAtual = 0;
    this.animation = [];
    this.numAnimacoes = 8;

    this.criarAnimacoes();
    this.nomeImagem = nomeImagem;
    }

// Heranca
Enemy.prototype = new Sprite();              // Define que o Player é um Sprite
Enemy.prototype.constructor = Enemy;

Enemy.prototype.tratarAnimacao = function(){
    switch (this.sentidoMovimento) {  //Movimento
        case 0:     //Direita
            this.estadoAnimacaoAtual = 3;
            break;
        case 1:     //Baixo
            this.estadoAnimacaoAtual = 2;
            break;
        case 2:     //Esquerda
            this.estadoAnimacaoAtual = 1;
            break;
        case 3:     //Cima
            this.estadoAnimacaoAtual = 0;
            break;
        default:
            break;
    }
    switch(this.atacando){
        case 0:
            break;
        case 1:
            //console.log("Atacando");
            this.estadoAnimacaoAtual = this.estadoAnimacaoAtual + 4;    
            break;
        default:
            break;
    }

    this.sizeImagem = this.animation[this.estadoAnimacaoAtual].sizeImagem;
    this.qtdAnimacoes = this.animation[this.estadoAnimacaoAtual].qtdAnimacoes;
    this.pose = this.animation[this.estadoAnimacaoAtual].pose;
    this.typeAnimation = this.animation[this.estadoAnimacaoAtual].typeAnimation;
    this.speedAnimation = this.animation[this.estadoAnimacaoAtual].speedAnimation;
    this.poseAtual = this.animation[this.estadoAnimacaoAtual].pose;
}

Enemy.prototype.desenhar = function(ctx){
    ctx.linewidth = 1;
    ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
    ctx.strokeStyle = "rgba(10, 10, 10, 0.4)";
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.ellipse(-this.s/2+1, -this.s/4+2, this.s-2, this.s/2-2, 0, 0, 2*Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    assetsMng.drawClipSize(ctx, this.nomeImagem, 
        this.sizeImagem * (this.animationState % this.qtdAnimacoes), this.sizeImagem * this.pose, this.sizeImagem, this.sizeImagem, 
        -6-this.sizeImagem/2, 4-this.sizeImagem, this.sizeImagem, this.sizeImagem);
    ctx.restore();
    if(debugMode == 1){
        this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCentro(ctx);
    }
    else if(debugMode == 2){
        this.desenharCell(ctx);         //Debug mode Grid
        this.desenharCaixaColisao(ctx);
    }
}  