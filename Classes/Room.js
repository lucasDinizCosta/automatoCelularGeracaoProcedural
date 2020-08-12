function Room(number){
    this.blocks = [];
    this.number = number;
    this.teleporterInitial = new Teleporter(2);         // (Inicio)Transição de uma sala pra outra
    this.teleporterFinal = new Teleporter(3);           // (Chegada)Transição de uma sala pra outra
    this.endingLevel;                                   // Teleportador que termina a fase
    this.beginLevel;                                    // Teleportador que Inicia a fase
    this.fireZones = [];                                // Area para a recarga do tempo
    this.treasures = [];                                // Lista de tesouros
    this.enemies = [];                                  // Lista de inimigos

    // Distancias
    this.distancias = {
        maxTeleportes: 999,
        maxFirezones: 0,
        maxTesouros: 0,
        maxInimigos: 999,
        compostas:{
            inimigosTeleportes:{
                max: 999,
                //min: 0,
            },
            inimigo_Tesouro_Teleporte:{
                max: 999,
                //min: 0,
            }, 
        },
    }
}

//Room.prototype = new Room();
//Room.prototype.constructor = Room;

Room.prototype.addBlock = function(row, column){
    let aux = [];
    aux.push(row);
    aux.push(column);
    this.blocks.push(aux);
}

Room.prototype.removeBlockByArrayIndex = function(index){
    this.blocks.splice(index, 1);
}

Room.prototype.removeBlockByMatrixIndex = function(row, column){
    for(let i = 0; i < this.blocks.length; i++){
        if(this.blocks[i][0] === row && this.blocks[i][1] === column){
            this.blocks.splice(i, 1);
            break;
        }
    }
}

// Procura 1 celula da sala que possui distancia value
Room.prototype.getCellByDist = function(value, option){
    switch(option){
        case 0:             // Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTeleportes == value){
                    return this.blocks[i];
                }
            }
            return null;                // Não encontrou nenhuma celula com a distancia determinada
            break;
        case 1:             // Firezones
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distFirezones == value){
                    return this.blocks[i];
                }
            }
            return null;                // Não encontrou nenhuma celula com a distancia determinada
            break;
        case 2:             // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distInimigos == value){
                    return this.blocks[i];
                }
            }
            return null;                // Não encontrou nenhuma celula com a distancia determinada
            break;
        case 3:             // Tesouros
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTesouros == value){
                    return this.blocks[i];
                }
            }
            return null;                // Não encontrou nenhuma celula com a distancia determinada
            break;
    }
}

// Procura LISTA de celulas da sala que possui distancia MAIOR OU IGUAL a Value
Room.prototype.getCellsByDist = function(value, option){
    let listCells = [];
    switch(option){
        case 0:             // Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTeleportes >= value){
                    listCells.push(this.blocks[i]);
                }
            }
            break;
        case 1:             // Firezones
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distFirezones >= value){
                    listCells.push(this.blocks[i]);
                }
            }
            break;
        case 2:             // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distInimigos >= value){
                    listCells.push(this.blocks[i]);
                }
            }
            break;
        case 3:             // Tesouros
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTesouros >= value){
                    listCells.push(this.blocks[i]);
                }
            }
            break;
    }

    return listCells;
}



// Retorna somente celulas que não tem nenhum outro elemento
// Procura LISTA de celulas da sala que possui distancia DENTRO DO INTERVALO DA MAIOR DISTANCIA
Room.prototype.getEmptyCellsByPercentageBetweenMaxDist = function(params){
    let listCells = [];
    let maxDist;
    let minimalValue;                                   // Menor elemento dentro da porcentagem correspondente
    switch(params.option){
        case 0:             // Teleportes
            maxDist = this.getMaxDist(0);
            minimalValue =  Math.floor((params.porcentagem * maxDist)/100);                 // Menor elemento no intervalo
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distFirezones !== 0 && this.blocks[i].distInimigos !== 0 
                    && this.blocks[i].distTesouros !== 0){   // Descarta celulas com outros elementos
                    if(this.blocks[i].distTeleportes >= minimalValue){
                        listCells.push(this.blocks[i]);
                    }
                }
            }
            break;
        case 1:             // Firezones
            maxDist = this.getMaxDist(1);
            minimalValue =  Math.floor((params.porcentagem * maxDist)/100);                 // Menor elemento no intervalo
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTeleportes !== 0 && this.blocks[i].distInimigos !== 0 
                    && this.blocks[i].distTesouros !== 0){   // Descarta celulas com outros elementos
                    if(this.blocks[i].distFirezones >= minimalValue){
                        listCells.push(this.blocks[i]);
                    }
                }
            }
            break;
        case 2:             // Inimigos
            maxDist = this.getMaxDist(2);
            minimalValue =  Math.floor((params.porcentagem * maxDist)/100);                 // Menor elemento no intervalo
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTeleportes !== 0 && this.blocks[i].distFirezones !== 0 
                    && this.blocks[i].distTesouros !== 0){   // Descarta celulas com outros elementos
                    if(this.blocks[i].distInimigos >= minimalValue){
                        listCells.push(this.blocks[i]);
                    }
                }
            }
            break;
        case 3:             // Tesouros
            maxDist = this.getMaxDist(3);
            minimalValue =  Math.floor((params.porcentagem * maxDist)/100);                 // Menor elemento no intervalo
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distTeleportes !== 0 && this.blocks[i].distFirezones !== 0 
                    && this.blocks[i].distInimigos !== 0){   // Descarta celulas com outros elementos
                    if(this.blocks[i].distTesouros >= minimalValue){
                        listCells.push(this.blocks[i]);
                    }
                }
            }
            break;
    }

    return listCells;
}

/**
 * Retorna a maior distancia na matriz dentre os atributos determinados
 */
Room.prototype.getMaxDist = function(option){
    let value = 0;
    switch(option){
        case 0:                     // Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                let bloco = this.blocks[i];
                if(bloco.distTeleportes >= value){
                    value = bloco.distTeleportes;
                }
            }
            break;
        case 1:                     // Firezones
            for(let i = 0; i < this.blocks.length; i++){
                let bloco = this.blocks[i];
                if(bloco.distFirezones >= value){
                    value = bloco.distFirezones;
                }
            }
            break;
        case 2:                     // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                let bloco = this.blocks[i];
                if(bloco.distInimigos >= value){
                    value = bloco.distInimigos;
                }
            }
            break;
        case 3:                     // Tesouros
            for(let i = 0; i < this.blocks.length; i++){
                let bloco = this.blocks[i];
                if(bloco.distTesouros >= value){
                    value = bloco.distTesouros;
                }
            }
            break;

       /*********************************************
        *           DISTANCIAS COMPOSTAS            *
        *********************************************/

        case 4:{                     // Inimigos + Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distInimigoTeleporte() >= value){
                    value = this.blocks[i].distInimigoTeleporte();
                }
            }
            break;
        }

        case 5:{                     // Inimigos + Teleportes + Tesouros
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distInimigo_Tesouro_Teleporte() >= value){
                    value = this.blocks[i].distInimigo_Tesouro_Teleporte();
                }
            }
            break;
        }
    }
    return value;
}

// Reseta a distancias da sala com o valor 999
Room.prototype.resetDistancia = function(option){
    switch(option){
        case 0:             // Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                this.blocks[i].distTeleportes = 999;
            }
            break;
        case 1:             // Firezones
            for(let i = 0; i < this.blocks.length; i++){
                this.blocks[i].distFirezones = 999;
            }
            break;
        case 2:             // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                this.blocks[i].distInimigos = 999;
            }
            break;
        case 3:             // Tesouros
            for(let i = 0; i < this.blocks.length; i++){
                this.blocks[i].distTesouros = 999;
            }
            break;
    }
}

Room.prototype.maxCamadaDistancias = function(){
   /*if(this.distancias.maxTeleportes === 0){
      this.distancias.maxTeleportes = this.getMaxDist(0);
      this.distancias.maxFirezones = this.getMaxDist(1);
      this.distancias.maxInimigos = this.getMaxDist(2);
      this.distancias.maxTesouros = this.getMaxDist(3);

      // Distancias compostas
      this.distancias.compostas.inimigosTeleportes.max = this.getMaxDist(4);
    }*/

    this.distancias.maxTeleportes = this.getMaxDist(0);
    this.distancias.maxFirezones = this.getMaxDist(1);
    this.distancias.maxInimigos = this.getMaxDist(2);
    this.distancias.maxTesouros = this.getMaxDist(3);

    // Distancias compostas
    this.distancias.compostas.inimigosTeleportes.max = this.getMaxDist(4);
    this.distancias.compostas.inimigo_Tesouro_Teleporte.max = this.getMaxDist(5);
  }

Room.prototype.move = function(dt){
    if(debugMode > 0){
        for(let i = 0; i < this.fireZones.length; i++){
            this.fireZones[i].mover(dt);       
        } 
    
        for(let i = 0; i < this.treasures.length; i++){
            this.treasures[i].mover(dt);       
        }
    
        /*for(let i = 0; i < this.enemies.length; i++){     
            this.enemies[i].movimento(dt);         
        } */  
    }
    else{
        for(let i = 0; i < this.fireZones.length; i++){
            this.fireZones[i].mover(dt);       
        } 
    
        for(let i = 0; i < this.treasures.length; i++){
            this.treasures[i].mover(dt);       
        }
    
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].persegue(player);         
            this.enemies[i].movimento(dt);         
        }   
    }   
} 

Room.prototype.draw = function(ctx){
    for(let i = 0; i < this.fireZones.length; i++){
        this.fireZones[i].desenhar(ctx);
    }    
    this.teleporterInitial.desenhar(ctx);    
    this.teleporterFinal.desenhar(ctx);

    for(let i = 0; i < this.treasures.length; i++){
        this.treasures[i].desenhar(ctx);
    }

    for(let i = 0; i < this.enemies.length; i++){
        this.enemies[i].desenhar(ctx);
    }  

}

Room.prototype.desenharCamadas = function(params = {}){
    params.ctx.fillStyle = "yellow";
    params.ctx.strokeStyle = "black";
    params.ctx.lineWidth = 2;
    params.ctx.font = "10px Arial Black";

    switch(debugMode){
        case 5:                   // Teleportes
            for(let i = 0; i < this.blocks.length; i++){
                //this.escreveTexto(params.ctx, this.blocks[i].distTeleportes + "", this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
                
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distTeleportes/this.distancias.maxTeleportes}, 100%, 50%)`;
                /*if(this.blocks[i].distTeleportes < Math.floor((25 * this.distancias.maxTeleportes)/100)){
                    params.ctx.fillStyle = "rgb(153, 255, 51)";
                }
                else{
                    if(this.blocks[i].distTeleportes < Math.floor((50 * this.distancias.maxTeleportes)/100)){
                        params.ctx.fillStyle = "rgb(253, 253, 127)";
                    }
                    else{
                        if(this.blocks[i].distTeleportes < Math.floor((75 * this.distancias.maxTeleportes)/100)){
                            params.ctx.fillStyle = "rgb(255, 153, 51)";
                        }
                        else{
                            params.ctx.fillStyle = "rgb(153, 0, 0)";
                        }
                    }
                }*/
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, this.blocks[i].distTeleportes, 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        case 6:                   // Firezones
            for(let i = 0; i < this.blocks.length; i++){
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distFirezones/this.distancias.maxFirezones}, 100%, 50%)`;
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, this.blocks[i].distFirezones, 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        case 7:                   // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distInimigos/this.distancias.maxInimigos}, 100%, 50%)`;
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, this.blocks[i].distInimigos, 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        case 8:                   // Tesouros
            for(let i = 0; i <  this.blocks.length; i++){
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distTesouros/this.distancias.maxTesouros}, 100%, 50%)`;
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, this.blocks[i].distTesouros, 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        case 9:                   // distInimigosTeleportes
        {
            for(let i = 0; i < this.blocks.length; i++){
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distInimigoTeleporte()/this.distancias.compostas.inimigosTeleportes.max}, 100%, 50%)`;
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, (this.blocks[i].distInimigoTeleporte(this.distancias.maxInimigos, this.distancias.maxTeleportes).toFixed(3)), 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        }
        case 10:                   // distInimigo_Tesouro_Teleporte
        {
            for(let i = 0; i < this.blocks.length; i++){
                params.ctx.save();
                params.ctx.fillStyle = `hsl(${150 *  this.blocks[i].distInimigo_Tesouro_Teleporte()/this.distancias.compostas.inimigo_Tesouro_Teleporte.max}, 100%, 50%)`;
                params.ctx.linewidth = 1;
                params.ctx.globalAlpha = 0.3;
                //ctx.fillStyle = "rgba(10, 10, 10, 0.4)";
                params.ctx.fillRect(this.blocks[i].coluna * params.s, this.blocks[i].linha * params.s, params.s, params.s);
                //ctx.strokeRect(c * this.s, l * this.s, this.s, this.s);
                params.ctx.restore();
                params.ctx.fillStyle = "yellow";
                params.ctx.strokeStyle = "black";
                this.escreveTexto(params.ctx, (this.blocks[i].distInimigo_Tesouro_Teleporte(this.distancias.maxInimigos, this.distancias.maxTeleportes, this.distancias.maxTesouros).toFixed(3)), 
                 this.blocks[i].coluna * params.s + params.s / 2, this.blocks[i].linha * params.s + params.s / 2);
            }
            break;
        }
    }
}

Room.prototype.escreveTexto = function (ctx, texto, x, y) {
    ctx.strokeText(texto, x, y);
    ctx.fillText(texto, x, y);
}

Room.prototype.drawTeleportersLine = function(ctx){
    // Ligação entre os teleportes
    ctx.save();
    ctx.strokeStyle = "black";                              // linha de acabamento preta pra facilitar a visualização
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
    ctx.lineTo(this.teleporterInitial.proximoTeleporte.x, this.teleporterInitial.proximoTeleporte.y);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
    ctx.lineTo(this.teleporterInitial.proximoTeleporte.x, this.teleporterInitial.proximoTeleporte.y);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.restore();
}

/**********************
 * Testes de colisões *
 **********************/

Room.prototype.collisionFirezones = function(player){
    for(let j = 0; j < this.fireZones.length; j++){
        if(this.fireZones[j].colidiuCom3(player))
            return true;
        
    }
    return false;
}

Room.prototype.collisionEnemies = function(player){
    for(let j = 0; j < this.enemies.length; j++){
        if(player.colidiuCom3(this.enemies[j])){
            return true;
        }
    }
    return false;
}

Room.prototype.collisionTreasures = function(player){
    for(let j = 0; j < this.treasures.length; j++){
        if(player.colidiuCom3(this.treasures[j])){
            player.tesourosColetados++;
            this.treasures.splice(j, 1);
            return true;
        }
    }
    return false;
}

/***********************
 * Ataque dos inimigos *
 **********************/

 Room.prototype.atackEnemiesPlayer = function(player){

    for(let i = 0; i < this.enemies.length; i++){
        let auxEnemy = this.enemies[i];
        auxEnemy.atackPlayer(player);
    }

 }


/***********************
 * Métodos de cópia    *
 ***********************/

// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
Room.prototype.copy = function(room){
    this.number = room.number;
    this.teleporterInitial.copy(room.teleporterInitial);
    this.teleporterFinal.copy(room.teleporterFinal);
    for(let i = 0; i < room.blocks.length; i++){
        let aux = new Cell();
        aux.clone(room.blocks[i]);
        this.blocks.push(aux);
    }

    this.distancias = {
        maxTeleportes: room.distancias.maxTeleportes,
        maxFirezones: room.distancias.maxFirezones,
        maxTesouros: room.distancias.maxTesouros,
        maxInimigos: room.distancias.maxInimigos,
        compostas: {
            inimigosTeleportes: {
                max: room.distancias.compostas.inimigosTeleportes.max,
            },
            inimigo_Tesouro_Teleporte: {
                max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
            }
        }
    }
}

// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
Room.prototype.copyByLevelGeneration = function(room, mapa){
    this.number = room.number;
    this.teleporterInitial.copy(room.teleporterInitial);
    this.teleporterFinal.copy(room.teleporterFinal);
    for(let i = 0; i < room.blocks.length; i++){
        let aux = mapa.cell[room.blocks[i][0]][ room.blocks[i][1]];         // BLOCKS[ID, LINHA/COLUNA]
        aux.room = room.number;
        this.blocks.push(aux);
    }
    this.distancias = {
        maxTeleportes: room.distancias.maxTeleportes,
        maxFirezones: room.distancias.maxFirezones,
        maxTesouros: room.distancias.maxTesouros,
        maxInimigos: room.distancias.maxInimigos,
        compostas: {
            inimigosTeleportes: {
                max: room.distancias.compostas.inimigosTeleportes.max,
            },
            inimigo_Tesouro_Teleporte: {
                max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
            }
        }
    }
    this.copyFireZones(room);
    this.copyTreasures(room);
    this.copyEnemies(room);
}

// Copia os dados da sala toda mas o vetor de blocos salva REFERENCIA PRA MATRIZ DO MAPA
Room.prototype.copyWithReference = function(room, mapa){
    this.number = room.number;
    this.teleporterInitial.copyTeleporte(room.teleporterInitial);
    this.teleporterFinal.copyTeleporte(room.teleporterFinal);

    for(let i = 0; i < room.blocks.length; i++){
        let aux = new Cell();
        aux.clone(mapa.getCell(room.blocks[i].linha, room.blocks[i].coluna));
        this.blocks.push(aux);
    }
    this.distancias = {
        maxTeleportes: room.distancias.maxTeleportes,
        maxFirezones: room.distancias.maxFirezones,
        maxTesouros: room.distancias.maxTesouros,
        maxInimigos: room.distancias.maxInimigos,
        compostas: {
            inimigosTeleportes: {
                max: room.distancias.compostas.inimigosTeleportes.max,
            },
            inimigo_Tesouro_Teleporte: {
                max: room.distancias.compostas.inimigo_Tesouro_Teleporte.max,
            }
        }
    }
    this.copyFireZones(room);
    this.copyTreasures(room);
    this.copyEnemies(room);
}

Room.prototype.copyFireZones = function(room){
    for(let i = 0; i < room.fireZones.length; i++){
        let aux = room.fireZones[i];
        let newFireZone = new FireZone();
        newFireZone.copyWithAnimation(aux);
        this.fireZones.push(newFireZone);
    }
}

Room.prototype.copyTreasures = function(room){
    for(let i = 0; i < room.treasures.length; i++){
        let aux = room.treasures[i];
        let newTreasure = new Treasure();
        newTreasure.copyWithAnimation(aux);
        this.treasures.push(newTreasure);
    }
}

Room.prototype.copyEnemies = function(room){
    for(let i = 0; i < room.enemies.length; i++){
        let aux = room.enemies[i];
        let newEnemy = new Enemy();
        newEnemy.copy(aux);
        this.enemies.push(newEnemy);
    }
}