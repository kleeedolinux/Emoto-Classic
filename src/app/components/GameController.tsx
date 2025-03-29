'use client';

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { useGameStateManager } from '../utils/gameStateManager';
import { useLivesManager } from '../utils/livesManager';
import { useModalManager } from '../utils/modalManager';
import { fetchEmotes, checkGuess, getEmoteNames } from '../utils/emoteService';
import { playSound } from '../utils/soundManager';
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
  handleChannelSubmit: (channel: string, challengeMode: string, timeLimit?: number) => Promise<void>;
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
  challengeMode: string;
  timeRemaining: number | null;
  timePercentage: number;
  lastEmote: Emote | null;
}

export default function GameController({ children, onAchievementUnlocked }: GameControllerProps) {
  const emoteInputRef = useRef<EmoteInputHandles>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDamageEffect, setShowDamageEffect] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [challengeMode, setChallengeMode] = useState('normal');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [initialTime, setInitialTime] = useState(20);
  const [lastEmote, setLastEmote] = useState<Emote | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLifeBeingReduced, setIsLifeBeingReduced] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

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

  const timePercentage = useMemo(() => {
    if (timeRemaining === null || initialTime === 0) return 0;
    return (timeRemaining / initialTime) * 100;
  }, [timeRemaining, initialTime]);

  const {
    livesState,
    decrementLives,
    incrementLives,
    resetLives,
    setMaxLives,
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

  useEffect(() => {
    if (gameState.gameActive && (challengeMode === 'tempo' || challengeMode === 'tempodesfocado') && timeRemaining !== null) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            
            if (!isLifeBeingReduced && !timerExpired) {
              setTimerExpired(true);
              setIsLifeBeingReduced(true);
              setShowDamageEffect(true);
              
              if (livesState.currentLives <= 1) { 
                if (gameState.currentEmote) {
                  setLastEmote(gameState.currentEmote);
                }

                const newHighScore = updateRecordIfNeeded();
                if (newHighScore) {
                  updateBestScore(gameState.score);
                }
                openGameOverDialog();
                setIsLifeBeingReduced(false);
                setTimerExpired(false);
                return 0;
              }
              
              decrementLives();
              
              setTimeout(() => {
                setShowDamageEffect(false);
                setTimeRemaining(initialTime);
                setIsLifeBeingReduced(false);
                setTimerExpired(false);
                
                if (gameState.emotes.length > 1) {
                  removeCurrentEmote();
                  chooseNextEmote();
                }
              }, 300);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    if (!gameState.gameActive && timerRef.current) {
      clearInterval(timerRef.current);
      setTimeRemaining(null);
      setTimerExpired(false);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameActive, challengeMode, timeRemaining, initialTime, updateRecordIfNeeded, 
      gameState.score, openGameOverDialog, decrementLives, livesState.currentLives, 
      removeCurrentEmote, chooseNextEmote, gameState.emotes.length, gameState.currentEmote, isLifeBeingReduced, timerExpired]);

  const handleAchievementUnlocked = useCallback((achievement: Achievement) => {
    if (onAchievementUnlocked) {
      onAchievementUnlocked(achievement);
    }
    setNewAchievements(prev => prev.filter(a => a.id !== achievement.id));
  }, [onAchievementUnlocked]);

  const handleChannelSubmit = useCallback(async (channel: string, challengeMode: string, timeLimit?: number) => {
    try {
      setLoading(true);
      setInvalidChannel(false);
      setChallengeMode(challengeMode);
      setIsLifeBeingReduced(false);
      setTimerExpired(false);
      
      const emotes = await fetchEmotes(channel);
      
      setLoading(false);
      
      if (emotes.length === 0) {
        setInvalidChannel(true);
        return;
      }
      
      resetLives();
      
      if (challengeMode === 'onelife') {
        setMaxLives(1);
        resetLives();
      } else {
        setMaxLives(4);
        resetLives();
      }
      
      initializeGame(channel, emotes);
      closeGameOverDialog();
      closeWinDialog();

      if (challengeMode === 'tempo' || challengeMode === 'tempodesfocado') {
        const customTimeLimit = timeLimit || 20; 
        setInitialTime(customTimeLimit);
        setTimeRemaining(customTimeLimit);
      } else {
        setTimeRemaining(null);
        setInitialTime(0);
      }

      incrementTotalGames();
    } catch (error) {
      console.error('Error fetching emotes:', error);
      setLoading(false);
      setInvalidChannel(true);
    }
  }, [initializeGame, resetLives, closeGameOverDialog, closeWinDialog, setLoading, setInvalidChannel, setMaxLives, setIsLifeBeingReduced]);

  const handleEmoteGuess = useCallback((guess: string) => {
    const { currentEmote, consecutiveCorrect, emotes, score } = gameState;
    
    if (!currentEmote) return;
    
    const isCorrect = checkGuess(guess, currentEmote);
    
    if (isCorrect) {
      if (emoteInputRef.current) {
        emoteInputRef.current.showCorrectGuess();
      }
      
      playSound('correct');
      
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
      
      if ((challengeMode === 'tempo' || challengeMode === 'tempodesfocado') && initialTime > 0) {
        setTimeRemaining(initialTime);
      }
    } else {
      if (emoteInputRef.current) {
        emoteInputRef.current.showIncorrectGuess();
      }
      
      playSound('incorrect');
      
      setShowDamageEffect(false);
      
      setTimeout(() => {
        if (!isLifeBeingReduced && !timerExpired) {
          setIsLifeBeingReduced(true);
          setShowDamageEffect(true);
          
          resetConsecutiveCorrect();
          
          if (livesState.currentLives <= 1) { 
            setLastEmote(currentEmote);
            
            const newHighScore = updateRecordIfNeeded();
            if (newHighScore) {
              updateBestScore(score);
            }
            openGameOverDialog();
            setIsLifeBeingReduced(false);
            return;
          }
          
          decrementLives();
          
          setTimeout(() => {
            setShowDamageEffect(false);
            setIsLifeBeingReduced(false);
            
            if ((challengeMode === 'tempo' || challengeMode === 'tempodesfocado') && initialTime > 0) {
              setTimeRemaining(initialTime);
            }
          }, 300);
        }
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
    handleAchievementUnlocked,
    challengeMode,
    initialTime,
    isLifeBeingReduced,
    timerExpired
  ]);

  useEffect(() => {
    if (!gameState.gameActive) {
      setLastEmote(null);
    }
  }, [gameState.gameActive]);

  return children({
    channel: gameState.channel,
    emoteNames: getEmoteNames(gameState.emotes),
    score: gameState.score,
    gameActive: gameState.gameActive,
    recordScore: gameState.recordScore,
    livesState,
    modalState,
    isLoading: gameState.isLoading,
    invalidChannel: gameState.invalidChannel,
    handleChannelSubmit,
    handleEmoteGuess,
    handleRetry: async () => {
      await handleChannelSubmit(gameState.channel, challengeMode, initialTime);
    },
    handleReset: () => {
      resetGame();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        setTimeRemaining(null);
      }
      setLastEmote(null);
    },
    handleShare: () => {},
    openHelpDialog,
    closeHelpDialog,
    openAchievementsDialog,
    closeAchievementsDialog,
    currentEmote: gameState.currentEmote,
    showConfetti,
    showDamageEffect,
    onAchievementUnlocked: handleAchievementUnlocked,
    challengeMode,
    timeRemaining,
    timePercentage,
    lastEmote
  });
} 