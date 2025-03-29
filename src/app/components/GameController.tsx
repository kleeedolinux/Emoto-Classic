'use client';

import { useCallback, useRef, useState } from 'react';
import { useGameStateManager } from '../utils/gameStateManager';
import { useLivesManager } from '../utils/livesManager';
import { useModalManager } from '../utils/modalManager';
import { fetchEmotes, checkGuess, getEmoteNames } from '../utils/emoteService';
import { Emote, Achievement } from '../types';
import { EmoteInputHandles } from './EmoteInput';
import { incrementCorrectGuesses, incrementTotalGames, updateBestScore } from '../utils/achievementManager';

interface GameControllerProps {
  children: (props: GameControllerOutput) => React.ReactNode;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

interface GameControllerOutput {
  channel: string;
  emoteNames: string[];
  score: number;
  gameActive: boolean;
  recordScore: number;
  livesState: { currentLives: number; maxLives: number };
  modalState: { 
    helpDialogOpen: boolean; 
    gameOverDialogOpen: boolean; 
    winDialogOpen: boolean;
    achievementsDialogOpen: boolean;
  };
  isLoading: boolean;
  invalidChannel: boolean;
  handleChannelSubmit: (channel: string) => Promise<void>;
  handleEmoteGuess: (guess: string) => void;
  handleRetry: () => Promise<void>;
  handleReset: () => void;
  handleShare: () => void;
  openHelpDialog: () => void;
  closeHelpDialog: () => void;
  openAchievementsDialog: () => void;
  closeAchievementsDialog: () => void;
  currentEmote: Emote | null;
  showConfetti: boolean;
  showDamageEffect: boolean;
  onAchievementUnlocked: (achievement: Achievement) => void;
}

export default function GameController({ children, onAchievementUnlocked }: GameControllerProps) {
  const emoteInputRef = useRef<EmoteInputHandles>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDamageEffect, setShowDamageEffect] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const {
    gameState,
    incrementScore,
    resetConsecutiveCorrect,
    removeCurrentEmote,
    chooseNextEmote,
    resetGame,
    initializeGame,
    updateRecordIfNeeded,
    setLoading,
    setInvalidChannel
  } = useGameStateManager();

  const {
    livesState,
    decrementLives,
    incrementLives,
    resetLives,
  } = useLivesManager();

  const {
    modalState,
    openHelpDialog,
    closeHelpDialog,
    openGameOverDialog,
    closeGameOverDialog,
    openWinDialog,
    closeWinDialog,
    openAchievementsDialog,
    closeAchievementsDialog,
  } = useModalManager();

  const handleAchievementUnlocked = useCallback((achievement: Achievement) => {
    if (onAchievementUnlocked) {
      onAchievementUnlocked(achievement);
    }
    setNewAchievements(prev => prev.filter(a => a.id !== achievement.id));
  }, [onAchievementUnlocked]);

  const handleChannelSubmit = useCallback(async (channel: string) => {
    try {
      setLoading(true);
      setInvalidChannel(false);
      
      const emotes = await fetchEmotes(channel);
      
      setLoading(false);
      
      if (emotes.length === 0) {
        setInvalidChannel(true);
        return;
      }
      
      resetLives();
      initializeGame(channel, emotes);
      closeGameOverDialog();
      closeWinDialog();

      incrementTotalGames();
    } catch (error) {
      console.error('Error fetching emotes:', error);
      setLoading(false);
      setInvalidChannel(true);
    }
  }, [initializeGame, resetLives, closeGameOverDialog, closeWinDialog, setLoading, setInvalidChannel]);

  const handleEmoteGuess = useCallback((guess: string) => {
    const { currentEmote, consecutiveCorrect, emotes, score } = gameState;
    
    if (!currentEmote) return;
    
    const isCorrect = checkGuess(guess, currentEmote);
    
    if (isCorrect) {
      if (emoteInputRef.current) {
        emoteInputRef.current.showCorrectGuess();
      }
      
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      incrementScore();
      
      const unlockedAchievements = incrementCorrectGuesses();
      if (unlockedAchievements.length > 0) {
        unlockedAchievements.forEach(achievement => {
          handleAchievementUnlocked(achievement);
        });
      }
      
      if ((consecutiveCorrect + 1) % 3 === 0 && livesState.currentLives < livesState.maxLives) {
        incrementLives();
      }
      
      if (emotes.length <= 1) {
        removeCurrentEmote();
        const newHighScore = updateRecordIfNeeded();
        if (newHighScore) {
          updateBestScore(score + 1);
        }
        openWinDialog();
        return;
      }
      
      removeCurrentEmote();
      chooseNextEmote();
    } else {
      if (emoteInputRef.current) {
        emoteInputRef.current.showIncorrectGuess();
      }
      
      setShowDamageEffect(false);
      
      setTimeout(() => {
        setShowDamageEffect(true);
        
        resetConsecutiveCorrect();
        decrementLives();
        
        if (livesState.currentLives <= 1) { 
          const newHighScore = updateRecordIfNeeded();
          if (newHighScore) {
            updateBestScore(score);
          }
          openGameOverDialog();
          return;
        }
        
        setTimeout(() => {
          setShowDamageEffect(false);
        }, 300);
      }, 10);
    }
  }, [
    gameState, 
    incrementScore, 
    livesState, 
    incrementLives, 
    removeCurrentEmote, 
    updateRecordIfNeeded, 
    openWinDialog, 
    chooseNextEmote, 
    resetConsecutiveCorrect, 
    decrementLives, 
    openGameOverDialog,
    handleAchievementUnlocked
  ]);

  const handleRetry = useCallback(async () => {
    const { channel } = gameState;
    if (channel) {
      closeGameOverDialog();
      document.body.style.pointerEvents = 'auto';
      await handleChannelSubmit(channel);
    }
  }, [gameState.channel, handleChannelSubmit, closeGameOverDialog]);

  const handleReset = useCallback(() => {
    resetGame();
    resetLives();
    closeGameOverDialog();
    closeWinDialog();
  }, [resetGame, resetLives, closeGameOverDialog, closeWinDialog]);

  const handleShare = useCallback(() => {
    alert(`Sharing score: ${gameState.score} for channel ${gameState.channel}`);
  }, [gameState.score, gameState.channel]);

  const emoteNames = gameState.emotes.length > 0 
    ? getEmoteNames(gameState.emotes) 
    : [];

  return children({
    channel: gameState.channel,
    emoteNames,
    score: gameState.score,
    gameActive: gameState.gameActive,
    recordScore: gameState.recordScore,
    livesState,
    modalState,
    isLoading: gameState.isLoading,
    invalidChannel: gameState.invalidChannel,
    handleChannelSubmit,
    handleEmoteGuess,
    handleRetry,
    handleReset,
    handleShare,
    openHelpDialog,
    closeHelpDialog,
    openAchievementsDialog,
    closeAchievementsDialog,
    currentEmote: gameState.currentEmote,
    showConfetti,
    showDamageEffect,
    onAchievementUnlocked: handleAchievementUnlocked
  });
} 