'use client';

import { Emote } from '../types';
import { normalizeString } from './normalizeString';

const API_ENDPOINT = 'https://emotes.crippled.dev/v1/channel';
const CACHE_EXPIRY = 1000 * 60 * 60; 
const REQUEST_TIMEOUT = 5000;
const PRELOAD_BATCH_SIZE = 5;

let emoteCache: Map<string, {
  timestamp: number;
  emotes: Emote[];
}> = new Map();

let imageCache: Map<string, HTMLImageElement> = new Map();
let loadingImages: Set<string> = new Set();
let normalizedNameCache: Map<string, string> = new Map();

export async function fetchEmotes(channel: string): Promise<Emote[]> {
  if (!channel.trim()) {
    return [];
  }

  const cached = emoteCache.get(channel);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.emotes;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const twitchResponse = await fetch(`https://decapi.me/twitch/id/${channel}`, {
      signal: controller.signal
    });
    const channelId = await twitchResponse.text();
    
    if (!channelId || channelId.includes('User not found')) {
      clearTimeout(timeoutId);
      return [];
    }
    
    const response = await fetch(`${API_ENDPOINT}/${channel}/all`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'force-cache',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error fetching emotes: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    const processedEmotes = processEmotes(data);
    
    emoteCache.set(channel, {
      timestamp: Date.now(),
      emotes: processedEmotes
    });
    
    batchPreloadImages(processedEmotes.slice(0, 20));
    
    return processedEmotes;
  } catch (error) {
    console.error('Error fetching emotes:', error);
    return [];
  }
}

export function getRandomEmote(emotes: Emote[]): Emote | null {
  if (emotes.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * emotes.length);
  return emotes[randomIndex];
}

export function checkGuess(guess: string, currentEmote: Emote | null): boolean {
  if (!currentEmote) return false;
  
  const normalizedGuess = getNormalizedString(guess);
  const normalizedEmoteName = getNormalizedString(currentEmote.name);
  
  console.log('Comparing:', { 
    original: { guess, emoteName: currentEmote.name },
    normalized: { normalizedGuess, normalizedEmoteName }
  });
  
  return normalizedGuess === normalizedEmoteName;
}

function getNormalizedString(str: string): string {
  if (normalizedNameCache.has(str)) {
    return normalizedNameCache.get(str)!;
  }
  
  const normalized = normalizeString(str);
  normalizedNameCache.set(str, normalized);
  return normalized;
}

export function removeEmote(emotes: Emote[], emoteToRemove: Emote): Emote[] {
  return emotes.filter(emote => emote.name !== emoteToRemove.name);
}

export function shareOnTwitter(score: number, channel: string, isWin: boolean): void {
  const text = isWin 
    ? `Eu adivinhei TODOS os ${score} emotes do canal ${channel} no Emoto! 🎮 #EmotoGame`
    : `Eu adivinhei ${score} emotes do canal ${channel} no Emoto! 🎮 #EmotoGame`;
    
  const url = 'https://emoto.juliaklee.wtf/';
  
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank'
  );
}

export function getEmoteNames(emotes: Emote[]): string[] {
  return [...new Set(emotes.map(emote => emote.name))];
}

function processEmotes(rawEmotes: any[]): Emote[] {
  return rawEmotes
    .filter(emote => {
      return emote && 
             typeof emote.code === 'string' && 
             Array.isArray(emote.urls) && 
             emote.urls.length > 0;
    })
    .map(emote => {
      const urlIndex = Math.min(2, emote.urls.length - 1);
      let imageUrl = '';
      
      if (typeof emote.urls[urlIndex]?.url === 'string') {
        imageUrl = emote.urls[urlIndex].url;
      } else if (typeof emote.urls[0]?.url === 'string') {
        imageUrl = emote.urls[0].url;
      }
      
      return {
        name: emote.code,
        url: imageUrl
      };
    })
    .filter(emote => emote.url !== '');
}

function batchPreloadImages(emotes: Emote[]): void {
  if (emotes.length === 0) return;
  
  const processBatch = (startIndex: number) => {
    const batch = emotes.slice(startIndex, startIndex + PRELOAD_BATCH_SIZE);
    batch.forEach(emote => preloadImage(emote.url));
    
    if (startIndex + PRELOAD_BATCH_SIZE < emotes.length) {
      setTimeout(() => processBatch(startIndex + PRELOAD_BATCH_SIZE), 100);
    }
  };
  
  processBatch(0);
}

function preloadImage(url: string): void {
  if (imageCache.has(url) || loadingImages.has(url)) return;
  
  loadingImages.add(url);
  
  const img = new Image();
  img.onload = () => {
    imageCache.set(url, img);
    loadingImages.delete(url);
  };
  img.onerror = () => {
    loadingImages.delete(url);
  };
  img.src = url;
}

export function clearCache(): void {
  emoteCache.clear();
  imageCache.clear();
  loadingImages.clear();
  normalizedNameCache.clear();
} 