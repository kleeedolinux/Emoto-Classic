import { Emote } from "./Emote";

export class EmoteService {
    private emoteNameCache: Map<string, string[]> = new Map();
    private emoteHtmlCache: Map<string, string> = new Map();
    private fetchCache: Map<string, any[]> = new Map();
    private processedEmotesCache: Map<string, Emote[]> = new Map();
    private imageCache: Map<string, HTMLImageElement> = new Map();
    private imageLoadQueue: string[] = [];
    private isLoadingImage: boolean = false;
    private maxConcurrentLoads: number = 3;
    private activeLoads: number = 0;
    
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
        
        this.preloadImage(emote.image);
        
        const html = `
        <a class="card">
            <img class="card--image4" src=${emote.image} alt=${emote.name} />
        </a>
        `;
        
        this.emoteHtmlCache.set(emote.name, html);
        return html;
    }
    
    preloadImage(src: string): void {
        if (this.imageCache.has(src)) {
            return;
        }
        
        if (!this.imageLoadQueue.includes(src)) {
            this.imageLoadQueue.push(src);
            this.processImageQueue();
        }
    }
    
    processImageQueue(): void {
        if (this.isLoadingImage || this.imageLoadQueue.length === 0 || this.activeLoads >= this.maxConcurrentLoads) {
            return;
        }
        
        this.isLoadingImage = true;
        
        while (this.imageLoadQueue.length > 0 && this.activeLoads < this.maxConcurrentLoads) {
            const src = this.imageLoadQueue.shift()!;
            this.activeLoads++;
            
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(src, img);
                this.activeLoads--;
                this.processImageQueue();
            };
            img.onerror = () => {
                this.activeLoads--;
                this.processImageQueue();
            };
            img.src = src;
        }
        
        this.isLoadingImage = false;
    }
    
    async fetchEmotes(channel: string): Promise<any[]> {
        if (this.fetchCache.has(channel)) {
            return this.fetchCache.get(channel)!;
        }
        
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
                    cache: "force-cache"
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const emotes = await response.json();
            
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
        
        const batchSize = 100;
        const batches = Math.ceil(emoteCount / batchSize);
        
        for (let b = 0; b < batches; b++) {
            const startIdx = b * batchSize;
            const endIdx = Math.min(startIdx + batchSize, emoteCount);
            
            for (let i = startIdx; i < endIdx; i++) {
                const imageUrl = emotes[i].urls[2].url;
                result[i] = {
                    name: emotes[i].code,
                    image: imageUrl,
                };
                
                this.preloadImage(imageUrl);
            }
        }
        
        this.processedEmotesCache.set(cacheKey, result);
        return result;
    }
    
    getRandomEmote(emotes: Emote[]): Emote {
        if (emotes.length === 0) {
            throw new Error("Cannot get random emote from empty array");
        }
        
        const randomIndex = Math.floor(Math.random() * emotes.length);
        return emotes[randomIndex];
    }
    
    removeCurrentEmote(emotesList: Emote[], currentEmote: Emote, emoteNames: string[]): void {
        if (emotesList.length > 1000) {
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
            const currentIndex = emotesList.indexOf(currentEmote);
            if (currentIndex !== -1) {
                emotesList.splice(currentIndex, 1);
            }
            
            const nameIndex = emoteNames.indexOf(currentEmote.name);
            if (nameIndex !== -1) {
                emoteNames.splice(nameIndex, 1);
            }
        }
        
        this.emoteNameCache.delete(this.getCacheKeyForEmotes(emotesList));
    }
    
    clearCache(): void {
        this.emoteNameCache.clear();
        this.emoteHtmlCache.clear();
        this.fetchCache.clear();
        this.processedEmotesCache.clear();
        this.imageCache.clear();
        this.imageLoadQueue = [];
        this.activeLoads = 0;
        this.isLoadingImage = false;
    }
    
    private getCacheKeyForEmotes(emotes: Emote[]): string {
        return emotes.length.toString();
    }
    
    private getCacheKeyForRawEmotes(emotes: any[]): string {
        return emotes.length.toString();
    }
} 