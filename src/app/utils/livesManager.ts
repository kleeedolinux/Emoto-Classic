'use client';

import { useState, useCallback, useRef } from 'react';

export interface LivesState {
  currentLives: number;
  maxLives: number;
}

export function useLivesManager(initialMaxLives: number = 4) {
  const [livesState, setLivesState] = useState<LivesState>({
    currentLives: initialMaxLives,
    maxLives: initialMaxLives
  });
  
  const decrementCooldownRef = useRef(false);
  const cooldownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const decrementLives = useCallback(() => {
    if (decrementCooldownRef.current) return;
    
    decrementCooldownRef.current = true;
    
    setLivesState(prev => ({
      ...prev,
      currentLives: Math.max(0, prev.currentLives - 1)
    }));
    
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    
    cooldownTimeoutRef.current = setTimeout(() => {
      decrementCooldownRef.current = false;
    }, 500);
  }, []);

  const incrementLives = useCallback(() => {
    setLivesState(prev => ({
      ...prev,
      currentLives: Math.min(prev.maxLives, prev.currentLives + 1)
    }));
  }, []);

  const resetLives = useCallback(() => {
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
    }
    decrementCooldownRef.current = false;
    
    setLivesState(prev => ({
      ...prev,
      currentLives: prev.maxLives
    }));
  }, []);

  const setMaxLives = useCallback((maxLives: number) => {
    setLivesState(prev => ({
      maxLives,
      currentLives: maxLives
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
    setMaxLives,
    isGameOver
  };
} 