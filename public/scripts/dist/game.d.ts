import { Emote } from "./emote";
import { UI } from "./UI";
import { Vidas } from "./vidas";
export declare class Game {
    channel: string;
    emotesList: Emote[];
    emoteNames: string[];
    emoteAtual: Emote;
    acertos: number;
    acertosSeguidos: number;
    vidasRestantes: number;
    vidas: Vidas;
    ui: UI;
    app: HTMLElement;
    loading: HTMLElement;
    showAcertos: HTMLElement;
    constructor(channel: string, emotesList: Emote[], emoteNames: string[], emoteAtual: Emote, acertos: number, acertosSeguidos: number, vidasRestantes: number, vidas: Vidas, ui: UI);
    getEmotenames(emote: Emote[]): void;
    showEmoteGame: (emote: Emote) => void;
}
