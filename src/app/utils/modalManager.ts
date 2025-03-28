'use client';

import { useCallback, useState } from 'react';

export interface ModalState {
  helpDialogOpen: boolean;
  gameOverDialogOpen: boolean;
  winDialogOpen: boolean;
}

export function useModalManager() {
  const [modalState, setModalState] = useState<ModalState>({
    helpDialogOpen: false,
    gameOverDialogOpen: false,
    winDialogOpen: false
  });

  const openHelpDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, helpDialogOpen: true }));
  }, []);

  const closeHelpDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, helpDialogOpen: false }));
  }, []);

  const openGameOverDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, gameOverDialogOpen: true }));
  }, []);

  const closeGameOverDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, gameOverDialogOpen: false }));
  }, []);

  const openWinDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, winDialogOpen: true }));
  }, []);

  const closeWinDialog = useCallback(() => {
    setModalState(prev => ({ ...prev, winDialogOpen: false }));
  }, []);

  return {
    modalState,
    openHelpDialog,
    closeHelpDialog,
    openGameOverDialog,
    closeGameOverDialog,
    openWinDialog,
    closeWinDialog
  };
} 