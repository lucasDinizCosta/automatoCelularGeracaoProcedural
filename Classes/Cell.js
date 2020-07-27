function Cell(params = {}) {
    let exemplo = { 
        tipo: 0, 
        room: -3, 
        distTeleportes: 999, 
        distFirezones: 999,  
        distInimigos: 999, 
        distTesouros: 999, 
        linha: 0, 
        coluna: 0
    };
 
    Object.assign(this, exemplo, params);   // Sobrescreve os atributos de params e exemplo na classe
}

Cell.prototype = new Cell();
Cell.prototype.constructor = Cell;

Cell.prototype.distInimigoTeleporte = function(maxInimigo = 1, maxTeleporte = 1){
    return ((this.distInimigos * 0.5)/maxInimigo + (this.distTeleportes * 0.5)/maxTeleporte);
}

Cell.prototype.distInimigo_Tesouro_Teleporte = function(maxInimigo = 1, maxTeleporte = 1, maxTesouro = 1){
    return ((this.distInimigos * 0.5)/maxInimigo + (this.distTeleportes * 0.5)/maxTeleporte +
    (this.distTesouros * 0.5)/maxTesouro);
}

Cell.prototype.clone = function(celula){
    this.tipo = celula.tipo; 
    this.room = celula.room;
    this.distTeleportes = celula.distTeleportes; 
    this.distFirezones = celula.distFirezones;
    this.distInimigos = celula.distInimigos;
    this.distTesouros = celula.distTesouros;
    this.linha = celula.linha;
    this.coluna = celula.coluna;
}
