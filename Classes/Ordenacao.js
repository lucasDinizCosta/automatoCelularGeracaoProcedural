function Ordenacao(){

}

Ordenacao.prototype = new Ordenacao();              // Define que o Enemy é um Sprite
Ordenacao.prototype.constructor = Ordenacao;

Ordenacao.prototype.quickSort = function(lista, inicio, fim, ordem) {
    if(inicio < fim)
    {	
        let p = this.partition(lista, inicio, fim, ordem);
        this.quickSort(lista, inicio, p - 1, ordem);
        this.quickSort(lista, p+1, fim, ordem);
    }
}

Ordenacao.prototype.partition = function(lista, inicio, fim, ordem) {
    //If you want to implement randomized quick sort
    // just uncomment the next two lines of code
    //int p = inicio + (int)Math.random()*((fim-inicio)+1); 
    //swap(lista, inicio, p);
    let p = inicio;
    switch(ordem){
        case 0:						//Ordenar por ordem crescente
            for(let n = p + 1; n <= fim; n++){
                if(lista[n] < lista[p]){	//Palavra 1 < Palavra 2 
                    this.swap(lista, n, p+1);
                    this.swap(lista, p, p+1);
                    p++;
                }
            }
            break;
        case 1:						//Ordenar por ordem decrescente
            for(let n = p + 1; n <= fim; n++){
                if(lista[n] > lista[p]){	
                    this.swap(lista, n, p+1);
                    this.swap(lista, p, p+1);
                    p++;
                }
            }
            break;
    }
    return p;
}

/**
 * Swap -> Método usado para trocar elementos
 */

Ordenacao.prototype.swap = function(lista, indice1, indice2) {
    let prodAux = lista[indice1];
    lista[indice1] = lista[indice2];
    lista[indice2] = prodAux;
}