'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen && dialogRef.current && !dialogRef.current.open) {
      try {
        dialogRef.current.showModal();
        setTimeout(() => setAnimateIn(true), 50);
      } catch (error) {
        console.error('Error showing dialog:', error);
      }
    } else if (!isOpen && dialogRef.current && dialogRef.current.open) {
      setAnimateIn(false);
      setTimeout(() => {
        try {
          if (dialogRef.current) {
            dialogRef.current.close();
          }
        } catch (error) {
          console.error('Error closing dialog:', error);
        }
      }, 300);
    }
  }, [isOpen]);

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Only handle outside clicks
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (
      dialogDimensions &&
      (e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom)
    ) {
      onClose();
    }
  };

  const handleCloseButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <dialog 
      ref={dialogRef} 
      className="help-dialog"
      onClick={handleDialogClick}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      style={{
        opacity: animateIn ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 2000
      }}
    >
      <div className="modalHelp">
        <h1 className="modalTitle">Como jogar</h1>
        <Image 
          className="gaming" 
          src="/img/hate.webp" 
          alt="Gaming Emote" 
          width={96} 
          height={96}
          unoptimized
        />
        <p className="modalText">
          Emoto é um jogo de adivinhação de emotes da Twitch.
          <br/><br/>
          <strong>COMO JOGAR:</strong>
          <br/>
          1. Insira o nome do canal → o jogo carrega TODOS os emotes (BTTV + 7TV).
          <br/>
          2. Um emote aparece → <strong>adivinhe o nome dele</strong>.
          <br/><br/>
          <strong>REGRAS:</strong>
          <br/>
          ✅ Acertou = <strong>+1 ponto</strong> (emote é removido).
          <br/>
          ❌ Errou = <strong>-1 vida</strong> (tente de novo).
          <br/>
          🔥 3 acertos seguidos = <strong>+1 vida extra</strong>.
          <br/>
          💀 4 erros = <strong>FIM DO JOGO</strong>.
          <br/><br/>
          <strong>CONTROLES RÁPIDOS:</strong>
          <br/>
          ↑/↓ = navega | Ctrl+Home/End = salto | Enter = seleciona | Esc = cancela
        </p>
        <button 
          onClick={handleCloseButtonClick} 
          className="modalCloseButton fa fa-close"
          type="button"
          aria-label="Close"
        ></button>
        <a 
          target="_blank" 
          href="https://github.com/Kleeedolinux/Emoto" 
          className="github fa fa-github"
          rel="noopener noreferrer"
        ></a>
      </div>
    </dialog>
  );
} 