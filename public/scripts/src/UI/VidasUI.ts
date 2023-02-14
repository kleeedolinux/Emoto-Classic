export class Vidas {
    vidasUI: HTMLElement = document.getElementById("vidas")!;
    vida1: HTMLElement = document.getElementById("vida1")!;
    vida2: HTMLElement = document.getElementById("vida2")!;
    vida3: HTMLElement = document.getElementById("vida3")!;
    vida4: HTMLElement = document.getElementById("vida4")!;

    checkVidas(vidasRestantes: number): void {
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