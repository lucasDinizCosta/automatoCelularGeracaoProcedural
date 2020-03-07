function FireZone() {
    this.sprite = new Sprite(16, 5);
    this.sprite.qtdAnimacoes = 3;
    this.sprite.h = 24;
    this.sprite.mover = function (dt) {
        this.pose += 4*dt;
        this.pose = this.pose > 4 ? 0 : this.pose;
    }

}

FireZone.prototype.desenhar = function (ctx) {
    this.sprite.desenhar(ctx);
}