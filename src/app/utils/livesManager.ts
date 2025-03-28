'use client';

import { useState, useCallback } from 'react';

export interface LivesState {
  currentLives: number;
  maxLives: number;
}

export function useLivesManager(maxLives: number = 4) {
  const [livesState, setLivesState] = useState<LivesState>({
    currentLives: maxLives,
    maxLives
  });

  const decrementLives = useCallback(() => {
    setLivesState(prev => ({
      ...prev,
      currentLives: Math.max(0, prev.currentLives - 1)
    }));
  }, []);

  const incrementLives = useCallback(() => {
    setLivesState(prev => ({
      ...prev,
      currentLives: Math.min(prev.maxLives, prev.currentLives + 1)
    }));
  }, []);

  const resetLives = useCallback(() => {
    setLivesState(prev => ({
      ...prev,
      currentLives: prev.maxLives
    }));
  }, []);

  const isGameOver = useCallback(() => {
    return livesState.currentLives <= 0;
  }, [livesState.currentLives]);

  return {
    livesState,
    decrementLives,
    incrementLives,
    resetLives,
    isGameOver
  };
} 