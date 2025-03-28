'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AutocompleteState } from '../types';

export function useAutocomplete(items: string[] = []) {
  const [state, setState] = useState<AutocompleteState>({
    filteredItems: [],
    selectedIndex: -1,
    isVisible: false
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filterItems = useCallback((query: string) => {
    if (!query.trim()) {
      setState(prev => ({ ...prev, filteredItems: [], selectedIndex: -1, isVisible: false }));
      return;
    }

    const filtered = items
      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 50);

    setState({
      filteredItems: filtered,
      selectedIndex: filtered.length > 0 ? 0 : -1,
      isVisible: filtered.length > 0
    });
  }, [items]);

  const navigate = useCallback((direction: 'up' | 'down' | 'home' | 'end') => {
    setState(prev => {
      if (prev.filteredItems.length === 0) return prev;

      let newIndex = prev.selectedIndex;
      switch (direction) {
        case 'up':
          newIndex = Math.max(0, prev.selectedIndex - 1);
          break;
        case 'down':
          newIndex = Math.min(prev.filteredItems.length - 1, prev.selectedIndex + 1);
          break;
        case 'home':
          newIndex = 0;
          break;
        case 'end':
          newIndex = prev.filteredItems.length - 1;
          break;
      }

      return { ...prev, selectedIndex: newIndex };
    });
  }, []);

  const selectItem = useCallback(() => {
    console.log("Selecting item from autocomplete state:", state);
    const { filteredItems, selectedIndex, isVisible } = state;
    if (!isVisible || selectedIndex < 0 || selectedIndex >= filteredItems.length) {
      return null;
    }

    const selectedValue = filteredItems[selectedIndex];
    console.log("Selected value:", selectedValue);
    
    setState(prev => ({ ...prev, isVisible: false }));
    return selectedValue;
  }, [state]);

  const showList = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: true }));
  }, []);

  const hideList = useCallback(() => {
    setState(prev => ({ ...prev, isVisible: false }));
  }, []);

  useEffect(() => {
    if (state.selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[state.selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [state.selectedIndex]);

  return {
    state,
    inputRef,
    listRef,
    filterItems,
    navigate,
    selectItem,
    showList,
    hideList
  };
} 