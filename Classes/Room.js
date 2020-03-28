function Room(number){
    this.blocks = [];
    this.number = number;
    this.teleporterInitial = new Teleporter(2);         // (Inicio)Transição de uma sala pra outra
    this.teleporterFinal = new Teleporter(3);           // (Chegada)Transição de uma sala pra outra
    this.endingLevel;                                   // Teleportador que termina a fase
    this.beginLevel;                                    // Teleportador que Inicia a fase
    this.fireZones = [];                                // Area para a recarga do tempo
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
                if(this.blocks[i].distFirezones == value){
                    listCells.push(this.blocks[i]);
                }
            }
            break;
        case 2:             // Inimigos
            for(let i = 0; i < this.blocks.length; i++){
                if(this.blocks[i].distInimigos == value){
                    listCells.push(this.blocks[i]);
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
    }
    return value;
}


// Desenha os teleportes e as coneções entre eles
Room.prototype.draw = function(ctx){
    for(let i = 0; i < this.fireZones.length; i++){
        this.fireZones[i].desenhar(ctx);
        this.fireZones[i].mover(0.16);          //FIXME gol de mão
    }    
    this.teleporterInitial.desenhar(ctx);    
    this.teleporterFinal.desenhar(ctx);
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
}

Room.prototype.copyFireZones = function(room){
    for(let i = 0; i < room.fireZones.length; i++){
        let aux = room.fireZones[i];
        let newFireZone = new FireZone();
        newFireZone.copy(aux);
        this.fireZones.push(newFireZone);
    }
}