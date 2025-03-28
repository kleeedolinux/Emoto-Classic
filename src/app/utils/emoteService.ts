'use client';

import { Emote } from '../types';
import { normalizeString } from './normalizeString';

const API_ENDPOINT = 'https://emotes.crippled.dev/v1/channel';
const CACHE_EXPIRY = 1000 * 60 * 60; 
let emoteCache: Map<string, {
  timestamp: number;
  emotes: Emote[];
}> = new Map();

let imageCache: Map<string, HTMLImageElement> = new Map();
let loadingImages: Set<string> = new Set();

export async function fetchEmotes(channel: string): Promise<Emote[]> {
  if (!channel.trim()) {
    return [];
  }

  const cached = emoteCache.get(channel);
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY) {
    return cached.emotes;
  }

  try {
    const twitchResponse = await fetch(`https://decapi.me/twitch/id/${channel}`);
    const channelId = await twitchResponse.text();
    
    if (!channelId || channelId.includes('User not found')) {
      return [];
    }
    
    const response = await fetch(`${API_ENDPOINT}/${channel}/all`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'force-cache'
    });

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
    
    preloadImages(processedEmotes.slice(0, 20));
    
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
  
  const normalizedGuess = normalizeString(guess);
  const normalizedEmoteName = normalizeString(currentEmote.name);
  
  console.log('Comparing:', { 
    original: { guess, emoteName: currentEmote.name },
    normalized: { normalizedGuess, normalizedEmoteName }
  });
  
  return normalizedGuess === normalizedEmoteName;
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
  const names = emotes.map(emote => emote.name);
  return [...new Set(names)];
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

function preloadImages(emotes: Emote[]): void {
  for (const emote of emotes) {
    preloadImage(emote.url);
  }
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
} 