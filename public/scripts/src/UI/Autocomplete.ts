import { Emote } from "../Game/Emote.js";
import { Game } from "../Game/Game.js";

export class Autocomplete {
    emotesListAutocomplete: HTMLElement;
    game: Game;
    private cachedFilterResults: Map<string, Emote[]> = new Map();
    private emotesList: Emote[] = [];
    private cachedHtml: Map<string, DocumentFragment> = new Map();
    
    constructor(game: Game) {
        this.game = game;
        this.emotesListAutocomplete = document.getElementById("emotes-list")!;
    }

    filterEmotesList(emotes: Emote[], inputText: string): Emote[] {
        if (!inputText) {
            return emotes.slice(0, 10);
        }
        
        const cacheKey = inputText.toLowerCase();
        if (this.cachedFilterResults.has(cacheKey)) {
            return this.cachedFilterResults.get(cacheKey)!;
        }
        
        const normalizedInput = cacheKey;
        const results = emotes.filter(x => 
            x.name.toLowerCase().includes(normalizedInput)
        ).slice(0, 10);
        
        this.cachedFilterResults.set(cacheKey, results);
        return results;
    }

    loadEmotesList(emotes: Emote[]): void {
        this.emotesList = emotes;
        this.cachedFilterResults.clear();
        this.cachedHtml.clear();
        
        if (emotes.length > 0) {
            this.renderEmotesList(emotes.slice(0, 10));
        }
    }
    
    renderEmotesList(emotes: Emote[]): void {
        const cacheKey = emotes.map(e => e.name).join('|');
        
        if (this.cachedHtml.has(cacheKey)) {
            this.emotesListAutocomplete.innerHTML = '';
            this.emotesListAutocomplete.appendChild(
                this.cachedHtml.get(cacheKey)!.cloneNode(true)
            );
            return;
        }
        
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');
        
        const items = emotes.map(emote => 
            `<li class="autocomplete-item" tabindex="0">${emote.name}</li>`
        ).join('');
        
        tempContainer.innerHTML = items;
        
        while (tempContainer.firstChild) {
            fragment.appendChild(tempContainer.firstChild);
        }
        
        this.cachedHtml.set(cacheKey, fragment.cloneNode(true) as DocumentFragment);
        
        this.emotesListAutocomplete.innerHTML = '';
        this.emotesListAutocomplete.appendChild(fragment);
    }
    
    updateAutocomplete(inputText: string): void {
        const filteredEmotes = this.filterEmotesList(this.emotesList, inputText);
        this.renderEmotesList(filteredEmotes);
    }
}