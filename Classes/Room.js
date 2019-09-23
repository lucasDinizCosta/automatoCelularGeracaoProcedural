function Room(number){
    this.blocks = [];
    this.number;
    this.teleporterInitial = [];      //(Inicio)Transição de uma sala pra outra
    this.teleporterFinal = [];        //(Chegada)Transição de uma sala pra outra
    this.endingLevel = [];            //Teleportador que termina a fase
}

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
    for(let i = 0; i < blocks.length; i++){
        if(this.blocks[i][0] === row && this.blocks[i][1] === column){
            this.blocks.splice(i, 1);
            break;
        }
    }
}