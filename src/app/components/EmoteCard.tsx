'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Emote } from '../types';

interface EmoteCardProps {
  emote: Emote;
}

export default function EmoteCard({ emote }: EmoteCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className={`card ${isHovering ? 'card-hover' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="cardImageContainer">
        <Image
          className="cardImage"
          src={emote.url}
          alt="Emote"
          width={128}
          height={128}
          priority
          unoptimized
          style={{
            transform: isHovering ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </div>
    </div>
  );
} 