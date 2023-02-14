import { Emote } from "../Game/Emote.js";
import { Game } from "../Game/Game.js";
export declare class Autocomplete {
    emotesListAutocomplete: HTMLElement;
    game: Game;
    constructor(game: Game);
    filterEmotesList(emotes: Emote[], inputText: string): Emote[];
    loadEmotesList(emotes: Emote[]): void;
}
