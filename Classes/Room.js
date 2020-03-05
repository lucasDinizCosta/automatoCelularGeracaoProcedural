function Room(number){
    this.blocks = [];
    this.number = number;
    this.teleporterInitial = new Teleporter(1);         // (Inicio)Transição de uma sala pra outra
    this.teleporterFinal = new Teleporter(2);           // (Chegada)Transição de uma sala pra outra
    this.endingLevel;                                   // Teleportador que termina a fase
    this.beginLevel;                                    // Teleportador que Inicia a fase
    this.areasSafe = [];                                // Area para a recarga do tempo
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

Room.prototype.draw = function(ctx){
    this.teleporterInitial.portal.desenhar(ctx);
    this.teleporterFinal.portal.desenhar(ctx);
    if(debugMode == 1){
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.teleporterInitial.portal.x, this.teleporterInitial.portal.y);
        ctx.lineTo(this.teleporterInitial.proximoTeleporte.portal.x, this.teleporterInitial.proximoTeleporte.portal.y);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.restore();
    }
}

Room.prototype.copy = function(room){
    //console.log("Copy -- Room: ");
    //console.log(this.number + " (this.number)--(Room.number) " + room.number);
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


Room.prototype.setTeleporter = function(mode, beginGX, beginGY, endGX, endGY){
    if(mode = 0){   //Initial mode
        let teleporter = new Teleporter(1);
        teleporter.startGX = beginGX;
        teleporter.startGY = beginGY;
        teleporter.finishGX = endGX;
        teleporter.finishGY = endGY;
        this.teleporterInitial = teleporter;
    }
    else{
        let teleporter = new Teleporter(2);
        teleporter.startGX = beginGX;
        teleporter.startGY = beginGY;
        teleporter.finishGX = endGX;
        teleporter.finishGY = endGY;
        this.teleporterFinal = teleporter;
    }
}