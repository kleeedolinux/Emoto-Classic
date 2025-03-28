'use client';

import { LivesState } from "../utils/livesManager";

interface LivesDisplayProps {
  livesState: LivesState;
}

export default function LivesDisplay({ livesState }: LivesDisplayProps) {
  const { currentLives, maxLives } = livesState;
  
  return (
    <div className="vidas">
      {Array.from({ length: maxLives }).map((_, index) => (
        <i 
          key={index} 
          className={`fa fa-heart vida ${index < currentLives ? '' : 'inactive'}`}
        ></i>
      ))}
    </div>
  );
} 