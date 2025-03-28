'use client';

import { useCallback, useEffect } from 'react';
import { AutocompleteState } from '../types';

interface KeyboardNavigationProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  autocompleteState: AutocompleteState;
  onNavigate: (direction: 'up' | 'down' | 'home' | 'end') => void;
  onSelect: () => string | null;
  onHide: () => void;
  onShow: () => void;
  onSubmit: () => void;
  onKeyboardSelect?: () => boolean;
  disabled?: boolean;
}

export default function KeyboardNavigation({
  inputRef,
  autocompleteState,
  onNavigate,
  onSelect,
  onHide,
  onShow,
  onSubmit,
  onKeyboardSelect,
  disabled = false
}: KeyboardNavigationProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled || !inputRef.current) return;
    
    const { isVisible, filteredItems } = autocompleteState;
    
    if (!isVisible) {
      if (event.key === 'ArrowDown' && filteredItems.length > 0) {
        event.preventDefault();
        onShow();
        onNavigate('down');
        return;
      }
      return;
    }
    
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onNavigate('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        onNavigate('down');
        break;
      case 'Home':
        if (event.ctrlKey) {
          event.preventDefault();
          onNavigate('home');
        }
        break;
      case 'End':
        if (event.ctrlKey) {
          event.preventDefault();
          onNavigate('end');
        }
        break;
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          onNavigate('up');
        } else {
          onNavigate('down');
        }
        break;
      case 'Enter':
        event.preventDefault();
        
        if (onKeyboardSelect) {
          const handled = onKeyboardSelect();
          if (handled) {
            return;
          }
        }
        
        const selectedValue = onSelect();
        if (selectedValue) {
          if (inputRef.current) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
              window.HTMLInputElement.prototype, "value"
            )?.set;
            
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(inputRef.current, selectedValue);
              
              const event = new Event('input', { bubbles: true });
              inputRef.current.dispatchEvent(event);
            } else {
              inputRef.current.value = selectedValue;
            }
            
            onHide();
            setTimeout(() => onSubmit(), 0);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        onHide();
        break;
    }
  }, [
    disabled, 
    inputRef, 
    autocompleteState, 
    onNavigate, 
    onSelect, 
    onHide, 
    onShow, 
    onSubmit,
    onKeyboardSelect
  ]);
  
  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
      
      return () => {
        inputElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [inputRef, handleKeyDown]);
  
  return null;
}