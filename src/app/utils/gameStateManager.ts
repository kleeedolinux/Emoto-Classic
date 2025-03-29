'use client';

import { useState, useCallback, useEffect } from 'react';
import { Emote } from '../types';
import { getRandomEmote } from './emoteService';
import { getStoredRecordScore, updateRecordScore, addRecentChannel } from './storageManager';

interface GameStateData {
  channel: string;
  emotes: Emote[];
  currentEmote: Emote | null;
  score: number;
  consecutiveCorrect: number;
  gameActive: boolean;
  recordScore: number;
  isLoading: boolean;
  invalidChannel: boolean;
}

export function useGameStateManager() {
  const [gameState, setGameState] = useState<GameStateData>({
    channel: '',
    emotes: [],
    currentEmote: null,
    score: 0,
    consecutiveCorrect: 0,
    gameActive: false,
    recordScore: getStoredRecordScore(),
    isLoading: false,
    invalidChannel: false
  });

  useEffect(() => {
    const storedRecord = getStoredRecordScore();
    if (storedRecord > 0) {
      setRecordScore(storedRecord);
    }
  }, []);

  const setChannel = useCallback((channel: string) => {
    setGameState(prev => ({ ...prev, channel }));
  }, []);

  const setEmotes = useCallback((emotes: Emote[]) => {
    setGameState(prev => ({ ...prev, emotes }));
  }, []);

  const setCurrentEmote = useCallback((emote: Emote | null) => {
    setGameState(prev => ({ ...prev, currentEmote: emote }));
  }, []);

  const incrementScore = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 1,
      consecutiveCorrect: prev.consecutiveCorrect + 1
    }));
  }, []);

  const resetConsecutiveCorrect = useCallback(() => {
    setGameState(prev => ({ ...prev, consecutiveCorrect: 0 }));
  }, []);

  const setGameActive = useCallback((active: boolean) => {
    setGameState(prev => ({ ...prev, gameActive: active }));
  }, []);

  const setRecordScore = useCallback((score: number) => {
    setGameState(prev => ({ ...prev, recordScore: score }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setGameState(prev => ({ ...prev, isLoading }));
  }, []);

  const setInvalidChannel = useCallback((invalidChannel: boolean) => {
    setGameState(prev => ({ ...prev, invalidChannel }));
  }, []);

  const updateRecordIfNeeded = useCallback(() => {
    const { score, recordScore } = gameState;
    if (score > recordScore) {
      const updated = updateRecordScore(score);
      if (updated) {
        setGameState(prev => ({ ...prev, recordScore: score }));
      }
      return updated;
    }
    return false;
  }, [gameState]);

  const removeCurrentEmote = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentEmote) return prev;
      
      const updatedEmotes = prev.emotes.filter(
        emote => emote.name !== prev.currentEmote?.name
      );
      
      return { ...prev, emotes: updatedEmotes };
    });
  }, []);

  const chooseNextEmote = useCallback(() => {
    setGameState(prev => {
      const nextEmote = getRandomEmote(prev.emotes);
      return {
        ...prev,
        currentEmote: nextEmote
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      emotes: [],
      currentEmote: null,
      score: 0,
      consecutiveCorrect: 0,
      gameActive: false,
      isLoading: false,
      invalidChannel: false
    }));
  }, []);

  const initializeGame = useCallback((channel: string, emotes: Emote[]) => {
    const randomEmote = getRandomEmote(emotes);
    
    addRecentChannel(channel);
    
    setGameState(prev => ({
      ...prev,
      channel,
      emotes,
      currentEmote: randomEmote,
      score: 0,
      consecutiveCorrect: 0,
      gameActive: true,
      isLoading: false,
      invalidChannel: false
    }));
  }, []);

  return {
    gameState,
    setChannel,
    setEmotes,
    setCurrentEmote,
    incrementScore,
    resetConsecutiveCorrect,
    setGameActive,
    setRecordScore,
    updateRecordIfNeeded,
    removeCurrentEmote,
    chooseNextEmote,
    resetGame,
    initializeGame,
    setLoading,
    setInvalidChannel
  };
} 