'use client';

import { useState, useEffect } from 'react';

interface ChannelInputProps {
  onChannelSubmit: (channel: string) => void;
  isLoading: boolean;
  invalidChannel: boolean;
}

export default function ChannelInput({ 
  onChannelSubmit, 
  isLoading, 
  invalidChannel 
}: ChannelInputProps) {
  const [channel, setChannel] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [animateShake, setAnimateShake] = useState(false);

  useEffect(() => {
    if (invalidChannel) {
      setAnimateShake(true);
      const timer = setTimeout(() => {
        setAnimateShake(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [invalidChannel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channel.trim() && !isLoading) {
      onChannelSubmit(channel.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          className={`channelInput ${isLoading ? 'loading-state' : ''} ${animateShake ? 'shake' : ''}`}
          placeholder={isLoading ? "Carregando..." : "Insira um canal da Twitch"}
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoComplete="off"
          disabled={isLoading}
          style={{
            animation: isFocused 
              ? 'pulse-input 2s infinite' 
              : isLoading 
                ? 'pulse 2s infinite' 
                : 'float 6s ease-in-out infinite',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      </form>
      <p className="subtitle2">sério, qualquer um.</p>
      
      {invalidChannel && (
        <div className="invalidChannel" style={{ animation: 'shake 0.5s' }}>
          Canal inválido ou sem emotes
        </div>
      )}
      
      {isLoading && (
        <div className="loading">
          <p className="loadingText">Carregando emotes...</p>
          <img 
            src="/img/loading2.webp" 
            alt="Loading" 
            className="loadingImage"
          />
          <div className="loadingBar">
            <div className="loadingBarProgress"></div>
          </div>
        </div>
      )}
    </>
  );
} 