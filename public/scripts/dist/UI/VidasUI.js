export class Vidas {
    constructor() {
        this.vidasUI = document.getElementById("vidas");
        this.vida1 = document.getElementById("vida1");
        this.vida2 = document.getElementById("vida2");
        this.vida3 = document.getElementById("vida3");
        this.vida4 = document.getElementById("vida4");
    }
    checkVidas(vidasRestantes) {
        if (vidasRestantes === 4) {
            this.vida1.style.color = "red";
            this.vida2.style.color = "red";
            this.vida3.style.color = "red";
            this.vida4.style.color = "red";
        }
        if (vidasRestantes === 3) {
            this.vida1.style.color = "red";
            this.vida2.style.color = "red";
            this.vida3.style.color = "red";
            this.vida4.style.color = "gray";
        }
        else if (vidasRestantes === 2) {
            this.vida1.style.color = "red";
            this.vida2.style.color = "red";
            this.vida3.style.color = "gray";
            this.vida4.style.color = "gray";
        }
        else if (vidasRestantes === 1) {
            this.vida1.style.color = "red";
            this.vida2.style.color = "gray";
            this.vida3.style.color = "gray";
            this.vida4.style.color = "gray";
        }
        else if (vidasRestantes === 0) {
            this.vida1.style.color = "gray";
            this.vida2.style.color = "gray";
            this.vida3.style.color = "gray";
            this.vida4.style.color = "gray";
        }
    }
    resetVidas() {
        this.vida1.style.color = "red";
        this.vida2.style.color = "red";
        this.vida3.style.color = "red";
        this.vida4.style.color = "red";
    }
}
//# sourceMappingURL=VidasUI.js.map