'use client';

import { useState, useEffect, useRef } from 'react';

interface ScoreBoardProps {
  score: number;
  livesState: {
    currentLives: number;
    maxLives: number;
  };
  gameActive: boolean;
}

export default function ScoreBoard({ score, livesState, gameActive }: ScoreBoardProps) {
  const [showLives, setShowLives] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const prevScore = useRef(score);
  
  useEffect(() => {
    setShowLives(gameActive);
  }, [gameActive]);
  
  useEffect(() => {
    if (score > prevScore.current) {
      setAnimateScore(true);
      const timer = setTimeout(() => {
        setAnimateScore(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
    prevScore.current = score;
  }, [score]);
  
  return (
    <div className="scoreContainer">
      <div className="livesContainer" style={{ display: showLives ? 'flex' : 'none' }}>
        {Array.from({ length: livesState.maxLives }).map((_, index) => (
          <i 
            key={index}
            className={`fa fa-heart lifeIcon ${index < livesState.currentLives ? 'active' : 'inactive'}`}
            style={index < livesState.currentLives ? {
              animationName: 'pulse',
              animationDuration: '1.5s',
              animationIterationCount: 'infinite',
              animationDelay: `${index * 0.2}s`
            } : undefined}
          />
        ))}
      </div>
      
      {gameActive && (
        <div 
          className={`scoreValue ${animateScore ? 'score-increased' : ''}`}
          style={animateScore ? {
            transform: 'scale(1.2)'
          } : undefined}
        >
          {score}
        </div>
      )}
    </div>
  );
} 