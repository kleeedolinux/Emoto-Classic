'use client';

import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import ChannelInput from './components/ChannelInput';
import EmoteInput, { EmoteInputHandles } from './components/EmoteInput';
import EmoteCard from './components/EmoteCard';
import ScoreBoard from './components/ScoreBoard';
import HelpDialog from './components/HelpDialog';
import GameOverDialog from './components/GameOverDialog';
import WinDialog from './components/WinDialog';
import Footer from './components/Footer';
import GameController from './components/GameController';
import { shareOnTwitter } from './utils/emoteService';
import Confetti from './components/Confetti';
import DamageEffect from './components/DamageEffect';
import { isFirstTimeUser, markUserAsReturning } from './utils/storageManager';

export default function Home() {
  const emoteInputRef = useRef<EmoteInputHandles>(null);
  // Track if we've checked first time user status
  const [hasCheckedFirstTime, setHasCheckedFirstTime] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  return (
    <GameController>
      {({ 
        channel, 
        emoteNames, 
        score, 
        gameActive, 
        recordScore,
        livesState, 
        modalState,
        isLoading,
        invalidChannel,
        handleChannelSubmit, 
        handleEmoteGuess, 
        handleRetry, 
        handleReset, 
        handleShare,
        openHelpDialog,
        closeHelpDialog,
        currentEmote,
        showConfetti,
        showDamageEffect
      }) => {
        // Use a separate useEffect to check for first time user
        useEffect(() => {
          // Only check once
          if (!hasCheckedFirstTime) {
            try {
              const firstTimeUser = isFirstTimeUser();
              setIsFirstVisit(firstTimeUser);
              
              if (firstTimeUser) {
                // Only open the dialog, don't mark as returning yet
                // (We'll do that when they close the dialog)
                setTimeout(() => {
                  openHelpDialog();
                  // Mark as returning right away to prevent showing again on restart
                  markUserAsReturning();
                }, 500);
              }
            } catch (error) {
              console.error('Error checking first time user:', error);
              // Mark as returning to prevent issues on restart
              markUserAsReturning();
            }
            setHasCheckedFirstTime(true);
          }
        }, [openHelpDialog, hasCheckedFirstTime]);
        
        // Handle help dialog closure for first-time users
        const handleHelpDialogClose = () => {
          // If this is the first visit, mark the user as returning
          if (isFirstVisit) {
            markUserAsReturning();
            setIsFirstVisit(false);
          }
          closeHelpDialog();
          document.body.style.pointerEvents = 'auto'; // Ensure pointer events are enabled
        };
        
        return (
          <main className="main-container">
            <div id="background-img"></div>
            
            <Header 
              onHelpClick={openHelpDialog} 
              onHomeClick={gameActive ? handleReset : undefined}
              gameActive={gameActive} 
            />
            
            <div className="content-wrapper">
              {!gameActive ? (
                <div className="home-container">
                  <ChannelInput 
                    onChannelSubmit={handleChannelSubmit}
                    isLoading={isLoading}
                    invalidChannel={invalidChannel}
                  />
                  
                  {recordScore > 0 && (
                    <div className="recorde">
                      Recorde: {recordScore}
                    </div>
                  )}
                </div>
              ) : (
                <div className="game-container">
                  {gameActive && currentEmote && (
                    <div className="app">
                      <EmoteCard 
                        emote={currentEmote}
                      />
                    </div>
                  )}
                  
                  <EmoteInput 
                    ref={emoteInputRef}
                    onEmoteGuess={handleEmoteGuess}
                    emotesList={emoteNames}
                    isVisible={gameActive && !modalState.gameOverDialogOpen && !modalState.winDialogOpen}
                  />
                  
                  <ScoreBoard 
                    score={score}
                    livesState={livesState}
                    gameActive={gameActive}
                  />
                </div>
              )}
            </div>
            
            <Footer />
            
            {/* Effects */}
            <Confetti active={showConfetti} />
            <DamageEffect active={showDamageEffect} />
            
            {/* Dialogs */}
            <HelpDialog 
              isOpen={modalState.helpDialogOpen} 
              onClose={handleHelpDialogClose} 
            />
            
            <GameOverDialog
              isOpen={modalState.gameOverDialogOpen}
              score={score}
              onTryAgain={handleRetry}
              onHome={handleReset}
              onShare={() => shareOnTwitter(score, channel, false)}
            />
            
            <WinDialog
              isOpen={modalState.winDialogOpen}
              score={score}
              onHome={handleReset}
              onShare={() => shareOnTwitter(score, channel, true)}
            />
          </main>
        );
      }}
    </GameController>
  );
}
