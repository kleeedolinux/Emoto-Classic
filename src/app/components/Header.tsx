'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onHelpClick: () => void;
  onHomeClick?: () => void;
  gameActive?: boolean;
}

export default function Header({ onHelpClick, onHomeClick, gameActive = false }: HeaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <>
      <div className="headerContainer" style={{ width: '100%', position: 'relative' }}>
        <a 
          tabIndex={-1} 
          className="questionCircle fa fa-question-circle" 
          onClick={onHelpClick}
          aria-label="Help"
          style={{
            animation: 'pulse 3s infinite'
          }}
        ></a>

        <div className="container">
          <h1 
            className={`title ${gameActive ? 'clickable' : ''}`} 
            onClick={gameActive ? onHomeClick : undefined}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              transform: isHovering && gameActive ? 'scale(1.05) rotate(-2deg)' : 'scale(1) rotate(0deg)',
              transition: 'all 0.3s ease',
              textShadow: isHovering && gameActive ? 
                '6px 6px 5px black, 0 0 10px rgba(123, 57, 228, 0.7)' : 
                '6px 6px 5px black'
            }}
          >
            emoto 2
          </h1>
          <h3 
            className="subtitle"
            style={{
              animation: 'float 4s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
          >
            um jogo sobre adivinhar emotes
          </h3>
          <p 
            className="version"
            style={{
              animation: 'pulse 2s infinite',
              animationDelay: '1s'
            }}
          >
            v1.0.0 - Remake
          </p>
          {!gameActive && (
            <Image 
              className="peepoThink" 
              src="/img/3x.webp" 
              alt="Thinking Emote" 
              width={96}
              height={96}
              priority
              unoptimized
              style={{
                animation: 'float 3s ease-in-out infinite',
                transition: 'transform 0.3s ease',
                transform: isHovering ? 'rotate(10deg)' : 'rotate(0deg)'
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            />
          )}
        </div>
      </div>
    </>
  );
} 