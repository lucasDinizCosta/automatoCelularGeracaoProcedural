function InputController() {
    this.nomes = {};
    this.codigos = {};
    this.teclas = {};

    this.joysticks = {};
}

InputController.prototype.setupKeyboard = function (novasTeclas) {
    for (var t = 0; t < novasTeclas.length; t++) {
        const tecla = novasTeclas[t];
        this.nomes[tecla.codigo] = tecla.nome;
        this.codigos[tecla.nome] = tecla.codigo;
        this.teclas[tecla.nome] = false;
    }
    var that = this;
    addEventListener("keydown", function (e) {
        var nome = that.nomes[e.keyCode];
        if (nome) {
            that.teclas[nome] = true;
            e.preventDefault();
        }

    });
    addEventListener("keyup", function (e) {
        var nome = that.nomes[e.keyCode];
        if (nome) {
            that.teclas[nome] = false;
            e.preventDefault();
        }

    });

}

InputController.prototype.setupJoysticks = function () {
    var that = this;
    addEventListener("gamepadconnected", function (e) {
        var gamepad = e.gamepad;
        console.log(`${gamepad.id} connected!`);
        that.joysticks[gamepad.index] = gamepad;

    });
    addEventListener("gamepaddisconnected", function (e) {
        var gamepad = e.gamepad;
        console.log(`${gamepad.id} disconnected!`);
        delete that.joysticks[gamepad.index];

    });
}

InputController.prototype.updateJoysticks = function(){
    var gamepads = navigator.getGamepads();
    for (var g = 0; g < gamepads.length; g++) {
        var gamepad = gamepads[g];
        if(gamepad){
            this.joysticks[gamepad.index] = gamepad;
        }
    }
}