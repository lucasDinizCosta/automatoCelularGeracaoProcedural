function SeedGenerator(params = {}){
    var exemplo = {
        seed_1: 1,
        seed_2: 0,
        seed_2_string: "apple"
    }

    Object.assign(this, exemplo, params);

    // Create xmur3 state:
    this.seed_2 = this.xmur3(this.seed_2_string);
}

//SeedGenerator.prototype = SeedGenerator;
//SeedGenerator.prototype.constructor = new SeedGenerator();

//  https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

/**
*   randomMethod 1:
*
* A elegância dessa solução, vem da falta de números "mágicos" 
* (além de 10000, que representa a quantidade mínima de dígitos que você deve jogar 
* fora para evitar padrões estranhos - veja resultados com os valores 10, 100, 1000 ) 
* Brevidade também é legal.
*
*   Antti Sykäri's algorithm
*/

SeedGenerator.prototype.getRandomMethod_1 = function(){
    var x = Math.sin(this.seed_1++) * 10000;
    return x - Math.floor(x);
}

SeedGenerator.prototype.getRandomIntMethod_1 = function(minimal, maximus){
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_1() * (max - min)) + min;
}

SeedGenerator.prototype.getRandomIntDefault = function(minimal, maximus){
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
*   randomMethod 2:
*   
*   xmur3:
*/

SeedGenerator.prototype.xmur3 = function(str) {
    let h;
    for(let i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

/**
*   sfc32: 
*/

SeedGenerator.prototype.sfc32 = function(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
        let t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}

/**
*    Mulberry32:
*/

SeedGenerator.prototype.mulberry32 = function(a) {
    return function() {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Output four 32-bit hashes to provide the seed for sfc32.
SeedGenerator.prototype.getRandomMethod_2 = function(){
    let func = this.sfc32(this.seed_2(), this.seed_2(), this.seed_2(), this.seed_2());  //Retorna uma função
    return func();                                                                      //Retorna o valor
}

SeedGenerator.prototype.getRandomIntMethod_2 = function(minimal, maximus){
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_2() * (max - min)) + min;
}

// Output one 32-bit hash to provide the seed for mulberry32.
SeedGenerator.prototype.getRandomMethod_3 = function(){
    let func = this.mulberry32(this.seed_2());                      //Retorna uma função
    return func();                                                  //Retorna o valor
}

SeedGenerator.prototype.getRandomIntMethod_3 = function(minimal, maximus){
    let min = Math.ceil(minimal);
    let max = Math.floor(maximus);
    return Math.floor(this.getRandomMethod_3() * (max - min)) + min;
}