import { Emote } from "./Emote";

export class EmoteService {
    private emoteNameCache: Map<string, {data: string[], timestamp: number}> = new Map();
    private emoteHtmlCache: Map<string, {data: string, timestamp: number}> = new Map();
    private fetchCache: Map<string, {data: any[], timestamp: number}> = new Map();
    private processedEmotesCache: Map<string, {data: Emote[], timestamp: number}> = new Map();
    private readonly CACHE_TTL = 3600000; 
    private readonly BATCH_SIZE = 200; 

    getEmoteNames(emotes: Emote[]): string[] {
        const cacheKey = this.getCacheKeyForEmotes(emotes);
        const cachedItem = this.emoteNameCache.get(cacheKey);
        
        if (cachedItem && (Date.now() - cachedItem.timestamp < this.CACHE_TTL)) {
            return cachedItem.data;
        }
        
        const names = emotes.map(emote => emote.name);
        this.emoteNameCache.set(cacheKey, {data: names, timestamp: Date.now()});
        return names;
    }
    
    getEmoteHtml(emote: Emote): string {
        const cachedItem = this.emoteHtmlCache.get(emote.name);
        
        if (cachedItem && (Date.now() - cachedItem.timestamp < this.CACHE_TTL)) {
            return cachedItem.data;
        }
        
        const html = `<a class="card"><img class="card--image4" src=${emote.image} alt=${emote.name} /></a>`;
        
        this.emoteHtmlCache.set(emote.name, {data: html, timestamp: Date.now()});
        return html;
    }
    
    async fetchEmotes(channel: string): Promise<any[]> {
        const cachedItem = this.fetchCache.get(channel);
        
        if (cachedItem && (Date.now() - cachedItem.timestamp < this.CACHE_TTL)) {
            return cachedItem.data;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        try {
            const response: Response = await fetch(
                `https://emotes.adamcy.pl/v1/channel/${channel}/emotes/twitch.7tv.bttv`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                    cache: "force-cache"
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const emotes = await response.json();
            
            this.fetchCache.set(channel, {data: emotes, timestamp: Date.now()});
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
        const cachedItem = this.processedEmotesCache.get(cacheKey);
        
        if (cachedItem && (Date.now() - cachedItem.timestamp < this.CACHE_TTL)) {
            return cachedItem.data;
        }
        
        const emoteCount = emotes.length;
        const result = new Array(emoteCount);
        const batches = Math.ceil(emoteCount / this.BATCH_SIZE);
        
        for (let b = 0; b < batches; b++) {
            const startIdx = b * this.BATCH_SIZE;
            const endIdx = Math.min(startIdx + this.BATCH_SIZE, emoteCount);
            
            for (let i = startIdx; i < endIdx; i++) {
                result[i] = {
                    name: emotes[i].code,
                    image: emotes[i].urls[2].url,
                };
            }
        }
        
        this.processedEmotesCache.set(cacheKey, {data: result, timestamp: Date.now()});
        return result;
    }
    
    getRandomEmote(emotes: Emote[]): Emote {
        if (emotes.length === 0) {
            throw new Error("Cannot get random emote from empty array");
        }
        
        const randomIndex = (Date.now() ^ (Math.random() * 0xFFFFFFFF)) % emotes.length;
        return emotes[randomIndex | 0]; 
    }
    
    removeCurrentEmote(emotesList: Emote[], currentEmote: Emote, emoteNames: string[]): void {
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
        
        this.emoteNameCache.delete(this.getCacheKeyForEmotes(emotesList));
    }
    
    clearCache(): void {
        this.emoteNameCache.clear();
        this.emoteHtmlCache.clear();
        this.fetchCache.clear();
        this.processedEmotesCache.clear();
    }
    
    pruneExpiredCache(): void {
        const now = Date.now();
        
        for (const [key, value] of this.emoteNameCache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.emoteNameCache.delete(key);
            }
        }
        
        for (const [key, value] of this.emoteHtmlCache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.emoteHtmlCache.delete(key);
            }
        }
        
        for (const [key, value] of this.fetchCache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.fetchCache.delete(key);
            }
        }
        
        for (const [key, value] of this.processedEmotesCache.entries()) {
            if (now - value.timestamp > this.CACHE_TTL) {
                this.processedEmotesCache.delete(key);
            }
        }
    }
    
    private getCacheKeyForEmotes(emotes: Emote[]): string {
        return emotes.length.toString();
    }
    
    private getCacheKeyForRawEmotes(emotes: any[]): string {
        return emotes.length.toString();
    }
} 