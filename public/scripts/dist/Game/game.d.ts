import { Autocomplete } from "../UI/Autocomplete.js";
import { Emote } from "./Emote";
import { UI } from "../UI/UI.js";
import { User } from "../Profile/User.js";
export declare class Game {
    channel: string;
    emotesList: Emote[];
    emoteNames: string[];
    emoteAtual: Emote;
    acertos: number;
    acertosSeguidos: number;
    vidasRestantes: number;
    autocomplete: Autocomplete;
    user: User;
    ui: UI;
    constructor(user: User);
    getEmotenames(emote: Emote[]): void;
    showEmoteGame: (emote: Emote) => void;
    returnToHome: () => void;
    restartGame(): void;
    getEmotesGame: (channel: string) => Promise<void>;
    continueGame: (emotesList: Emote[]) => void;
    gameplay: () => void;
}
