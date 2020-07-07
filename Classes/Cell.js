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

Cell.prototype.distInimigoTeleporte = function(){
    return (3 * this.distInimigos + 2 * this.distTeleportes);
}
