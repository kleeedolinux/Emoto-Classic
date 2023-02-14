import { Emote } from "./emote";
import { UI } from "./UI";
import { Vidas } from "./vidas";

export class Game {
    channel: string;
    emotesList: Emote[];
    emoteNames: string[];
    emoteAtual: Emote;
    acertos: number;
    acertosSeguidos: number;
    vidasRestantes: number;
    vidas: Vidas;
    ui: UI;

    app: HTMLElement = document.getElementById("app")!;
    loading: HTMLElement = document.getElementById("loading")!;
    showAcertos: HTMLElement = document.getElementById("acertos")!;

    constructor(channel: string, emotesList: Emote[], emoteNames: string[], emoteAtual: Emote, acertos: number, acertosSeguidos: number, vidasRestantes: number, vidas: Vidas, ui: UI) {
        this.channel = channel;
        this.emotesList = emotesList;
        this.emoteNames = emoteNames;
        this.emoteAtual = emoteAtual;
        this.acertos = acertos;
        this.acertosSeguidos = acertosSeguidos;
        this.vidasRestantes = vidasRestantes;
        this.vidas = vidas
        this.ui = ui

    }

    getEmotenames(emote: Emote[]): void {
        emote.forEach((emote: Emote) => {
            this.emoteNames.push(emote.name);
        });
    }

    showEmoteGame = (emote: Emote): void => {
        let output: string = `
        <a class="card">
    
            <img class="card--image4" src=${emote.image} alt=${emote.name} />
    
        </a>
        `;
        this.app.innerHTML += output;
    };

}