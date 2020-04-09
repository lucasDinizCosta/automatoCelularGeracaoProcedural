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

// Retorma somente celulas que não tem nenhum outro elemento
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
    }
    return value;
}

// Desenha os teleportes e as conexões entre eles
Room.prototype.draw = function(ctx){
    for(let i = 0; i < this.fireZones.length; i++){
        this.fireZones[i].desenhar(ctx);
        this.fireZones[i].mover(0.16);          //FIXME gol de mão ==== Animação do fogo
    }    
    this.teleporterInitial.desenhar(ctx);    
    this.teleporterFinal.desenhar(ctx);

    for(let i = 0; i < this.treasures.length; i++){
        this.treasures[i].desenhar(ctx);
    }

    for(let i = 0; i < this.enemies.length; i++){
        this.enemies[i].desenhar(ctx);
    }  
    
    // Ligação entre os teleportes
    if(debugMode == 1){
        ctx.save();
        ctx.strokeStyle = "black";                              // linha de acabamento preta pra facilitar a visualização
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
        ctx.lineTo(this.teleporterInitial.proximoTeleporte.x, this.teleporterInitial.proximoTeleporte.y);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.teleporterInitial.x, this.teleporterInitial.y);
        ctx.lineTo(this.teleporterInitial.proximoTeleporte.x, this.teleporterInitial.proximoTeleporte.y);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.restore();
    }
}

/**********************
 * Testes de colisões *
 **********************/

Room.prototype.collisionFirezones = function(player){
    for(let j = 0; j < this.fireZones.length; j++){
        if(player.colidiuCom2(this.fireZones[j])){
           return true;
        }
    }
    return false;
}

Room.prototype.collisionEnemies = function(player){
    for(let j = 0; j < this.enemies.length; j++){
        if(player.colidiuCom2(this.enemies[j])){
           return true;
        }
    }
    return false;
}

Room.prototype.collisionTreasures = function(player){
    for(let j = 0; j < this.treasures.length; j++){
        if(player.colidiuCom2(this.treasures[j])){
           return true;
        }
    }
    return false;
}

// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
Room.prototype.copy = function(room){
    //console.log("Copy -- Room: ");
    //console.log(this.number + " (this.number)--(Room.number) " + room.number);
    //console.log("ROOM.copy():");

    this.number = room.number;
    this.teleporterInitial.copy(room.teleporterInitial);
    this.teleporterFinal.copy(room.teleporterFinal);
    for(let i = 0; i < room.blocks.length; i++){
        let aux = [];
        aux.push(room.blocks[i][0]);
        aux.push(room.blocks[i][1]);
        this.blocks.push(aux);
    }
}

// Copia os dados da sala toda mas o vetor de blocos salva a linha e coluna apenas
Room.prototype.copyByLevelGeneration = function(room, mapa){
    //console.log("Copy -- Room: ");
    //console.log(this.number + " (this.number)--(Room.number) " + room.number);
    //console.log("ROOM.copyByLevelGeneration():");
    this.number = room.number;
    this.teleporterInitial.copy(room.teleporterInitial);
    this.teleporterFinal.copy(room.teleporterFinal);
    for(let i = 0; i < room.blocks.length; i++){
        let aux = mapa.cell[room.blocks[i][0]][ room.blocks[i][1]];
        aux.room = room.number;
        this.blocks.push(aux);
    }
    this.copyFireZones(room);
    this.copyTreasures(room);
}

// Copia os dados da sala toda mas o vetor de blocos salva REFERENCIA PRA MATRIZ DO MAPA
Room.prototype.copyWithReference = function(room, mapa){
    
    //console.log("ROOM.copyWithReference():");
    //console.log(mapa);
    this.number = room.number;
    this.teleporterInitial.copyTeleporte(room.teleporterInitial);
    this.teleporterFinal.copyTeleporte(room.teleporterFinal);
    for(let i = 0; i < room.blocks.length; i++){
        let aux = mapa.getCell(room.blocks[i].linha, room.blocks[i].coluna);
        aux.room = room.number;
        this.blocks.push(aux);
    }
    this.copyFireZones(room);
    this.copyTreasures(room);
    this.copyEnemies(room);
}

Room.prototype.copyFireZones = function(room){
    for(let i = 0; i < room.fireZones.length; i++){
        let aux = room.fireZones[i];
        let newFireZone = new FireZone();
        newFireZone.copy(aux);
        this.fireZones.push(newFireZone);
    }
}

Room.prototype.copyTreasures = function(room){
    for(let i = 0; i < room.treasures.length; i++){
        let aux = room.treasures[i];
        let newTreasure = new Treasure();
        newTreasure.copy(aux);
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