import { Emote } from "./emote";
import { Game } from "./game";
export declare class Autocomplete {
    emotesListAutocomplete: HTMLElement;
    game: Game;
    constructor(game: Game);
    filterEmotesList(emotes: Emote[], inputText: string): Emote[];
    loadEmotesList(emotes: Emote[]): void;
}
