import { Emote } from "./Emote";

export class EmoteService {
    private emoteNameCache: Map<string, string[]> = new Map();
    private emoteHtmlCache: Map<string, string> = new Map();
    private fetchCache: Map<string, any[]> = new Map();
    private processedEmotesCache: Map<string, Emote[]> = new Map();
    
    getEmoteNames(emotes: Emote[]): string[] {
        const cacheKey = this.getCacheKeyForEmotes(emotes);
        
        if (this.emoteNameCache.has(cacheKey)) {
            return this.emoteNameCache.get(cacheKey)!;
        }
        
        const names = emotes.map(emote => emote.name);
        this.emoteNameCache.set(cacheKey, names);
        return names;
    }
    
    getEmoteHtml(emote: Emote): string {
        if (this.emoteHtmlCache.has(emote.name)) {
            return this.emoteHtmlCache.get(emote.name)!;
        }
        
        const html = `
        <a class="card">
            <img class="card--image4" src=${emote.image} alt=${emote.name} />
        </a>
        `;
        
        this.emoteHtmlCache.set(emote.name, html);
        return html;
    }
    
    async fetchEmotes(channel: string): Promise<any[]> {
        // Check cache first
        if (this.fetchCache.has(channel)) {
            return this.fetchCache.get(channel)!;
        }
        
        // Use AbortController to handle timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        try {
            const response: Response = await fetch(
                `https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                    // Add cache control for better performance
                    cache: "force-cache"
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const emotes = await response.json();
            
            // Cache the results
            this.fetchCache.set(channel, emotes);
            return emotes;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            
            throw error;
        }
    }
    
    processEmotes(emotes: any[]): Emote[] {
        const cacheKey = this.getCacheKeyForRawEmotes(emotes);
        
        if (this.processedEmotesCache.has(cacheKey)) {
            return this.processedEmotesCache.get(cacheKey)!;
        }
        
        const emoteCount = emotes.length;
        const result = new Array(emoteCount);
        
        // Process in batches for better performance
        const batchSize = 100;
        const batches = Math.ceil(emoteCount / batchSize);
        
        for (let b = 0; b < batches; b++) {
            const startIdx = b * batchSize;
            const endIdx = Math.min(startIdx + batchSize, emoteCount);
            
            for (let i = startIdx; i < endIdx; i++) {
                result[i] = {
                    name: emotes[i].code,
                    image: emotes[i].urls[2].url,
                };
            }
        }
        
        this.processedEmotesCache.set(cacheKey, result);
        return result;
    }
    
    getRandomEmote(emotes: Emote[]): Emote {
        if (emotes.length === 0) {
            throw new Error("Cannot get random emote from empty array");
        }
        
        // Use crypto for better randomness if available
        if (window.crypto && window.crypto.getRandomValues) {
            const randomArray = new Uint32Array(1);
            window.crypto.getRandomValues(randomArray);
            const randomIndex = randomArray[0] % emotes.length;
            return emotes[randomIndex];
        }
        
        // Fallback to Math.random
        const randomIndex = Math.floor(Math.random() * emotes.length);
        return emotes[randomIndex];
    }
    
    removeCurrentEmote(emotesList: Emote[], currentEmote: Emote, emoteNames: string[]): void {
        // Use faster removal method when possible
        if (emotesList.length > 1000) {
            // For large arrays, swap with last element and pop (O(1) removal)
            const currentIndex = emotesList.indexOf(currentEmote);
            if (currentIndex !== -1) {
                const lastElement = emotesList[emotesList.length - 1];
                emotesList[currentIndex] = lastElement;
                emotesList.pop();
            }
            
            const nameIndex = emoteNames.indexOf(currentEmote.name);
            if (nameIndex !== -1) {
                const lastElement = emoteNames[emoteNames.length - 1];
                emoteNames[nameIndex] = lastElement;
                emoteNames.pop();
            }
        } else {
            // For smaller arrays, use standard splice (maintains order)
            const currentIndex = emotesList.indexOf(currentEmote);
            if (currentIndex !== -1) {
                emotesList.splice(currentIndex, 1);
            }
            
            const nameIndex = emoteNames.indexOf(currentEmote.name);
            if (nameIndex !== -1) {
                emoteNames.splice(nameIndex, 1);
            }
        }
        
        // Clear relevant cache entries
        this.emoteNameCache.delete(this.getCacheKeyForEmotes(emotesList));
    }
    
    clearCache(): void {
        this.emoteNameCache.clear();
        this.emoteHtmlCache.clear();
        this.fetchCache.clear();
        this.processedEmotesCache.clear();
    }
    
    private getCacheKeyForEmotes(emotes: Emote[]): string {
        return emotes.length.toString();
    }
    
    private getCacheKeyForRawEmotes(emotes: any[]): string {
        return emotes.length.toString();
    }
} 