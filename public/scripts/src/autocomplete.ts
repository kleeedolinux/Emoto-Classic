import { Emote } from "./emote";
import { Game } from "./game";

export class Autocomplete{
    emotesListAutocomplete: HTMLElement = document.getElementById("emotes-list")!;
    game: Game
    constructor(game: Game) {
        this.game = game
    }

    filterEmotesList(emotes: Emote[], inputText: string): Emote[] {
        return emotes.filter((x) =>
            x.name.toLowerCase().includes(inputText.toLowerCase())
        );
    }

    loadEmotesList(emotes: Emote[]): void {
        if (emotes.length > 0) {
            this.emotesListAutocomplete.innerHTML = "";
            let innerElement: string = "";
            emotes.forEach((emote: Emote) => {
                innerElement += `<li class="autocomplete-item" tabindex = "0">${emote.name}</li>`;
            });
            this.emotesListAutocomplete.innerHTML = innerElement;
        }
    }
}