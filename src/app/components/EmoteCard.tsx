'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Emote } from '../types';

interface EmoteCardProps {
  emote: Emote;
  style?: React.CSSProperties;
}

export default function EmoteCard({ emote, style = {} }: EmoteCardProps) {
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
          priority={true}
          unoptimized={true}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            transform: isHovering ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease-in-out',
            ...style
          }}
        />
      </div>
    </div>
  );
} 