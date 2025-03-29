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
import AchievementsDialog from './components/AchievementsDialog';
import { AchievementNotificationContainer } from './components/AchievementNotification';
import { Achievement } from './types';

export default function Home() {
  const emoteInputRef = useRef<EmoteInputHandles>(null);
  const [hasCheckedFirstTime, setHasCheckedFirstTime] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  return (
    <AchievementNotificationContainer>
      {({ addAchievement }) => {
        const handleAchievementWithNotification = (achievement: Achievement) => {
          console.log('Achievement unlocked:', achievement.title);
          addAchievement(achievement);
        };

        return (
          <GameController onAchievementUnlocked={handleAchievementWithNotification}>
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
              openAchievementsDialog,
              closeAchievementsDialog,
              currentEmote,
              showConfetti,
              showDamageEffect
            }) => {
              useEffect(() => {
                if (!hasCheckedFirstTime) {
                  try {
                    const firstTimeUser = isFirstTimeUser();
                    setIsFirstVisit(firstTimeUser);
                    
                    if (firstTimeUser) {
                      setTimeout(() => {
                        openHelpDialog();
                        markUserAsReturning();
                      }, 500);
                    }
                  } catch (error) {
                    console.error('Error checking first time user:', error);
                    markUserAsReturning();
                  }
                  setHasCheckedFirstTime(true);
                }
              }, [openHelpDialog, hasCheckedFirstTime]);
              
              const handleHelpDialogClose = () => {
                if (isFirstVisit) {
                  markUserAsReturning();
                  setIsFirstVisit(false);
                }
                closeHelpDialog();
                document.body.style.pointerEvents = 'auto'; 
              };
              
              return (
                <main className="main-container">
                  <div id="background-img"></div>
                  
                  <Header 
                    onHelpClick={openHelpDialog} 
                    onHomeClick={gameActive ? handleReset : undefined}
                    gameActive={gameActive} 
                    onAchievementsClick={openAchievementsDialog}
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
                  
                  <AchievementsDialog
                    isOpen={modalState.achievementsDialogOpen}
                    onClose={closeAchievementsDialog}
                  />
                  
                  <Footer />
                </main>
              );
            }}
          </GameController>
        );
      }}
    </AchievementNotificationContainer>
  );
}
