export class Autocomplete {
    constructor(game) {
        this.emotesListAutocomplete = document.getElementById("emotes-list");
        this.game = game;
    }
    filterEmotesList(emotes, inputText) {
        return emotes.filter((x) => x.name.toLowerCase().includes(inputText.toLowerCase()));
    }
    loadEmotesList(emotes) {
        if (emotes.length > 0) {
            this.emotesListAutocomplete.innerHTML = "";
            let innerElement = "";
            emotes.forEach((emote) => {
                innerElement += `<li class="autocomplete-item" tabindex = "0">${emote.name}</li>`;
            });
            this.emotesListAutocomplete.innerHTML = innerElement;
        }
    }
}
//# sourceMappingURL=autocomplete.js.map