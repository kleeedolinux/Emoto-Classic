'use client';

import React from 'react';
import { AutocompleteState } from '../types';

interface AutocompleteListProps {
  state: AutocompleteState;
  listRef: React.RefObject<HTMLUListElement | null>;
  onItemClick: (item: string) => void;
}

export default function AutocompleteList({
  state,
  listRef,
  onItemClick
}: AutocompleteListProps) {
  const { filteredItems, selectedIndex, isVisible } = state;
  
  if (!isVisible || filteredItems.length === 0) {
    return null;
  }
  
  const handleItemClick = (item: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Item clicked:", item);
    onItemClick(item);
  };
  
  return (
    <ul 
      ref={listRef}
      className="autocompleteEmotes"
      id="emotes-list"
    >
      {filteredItems.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={index === selectedIndex ? 'selected' : ''}
          onClick={(e) => handleItemClick(item, e)}
          onMouseDown={(e) => e.preventDefault()} 
          tabIndex={0}
          data-index={index}
        >
          {item}
        </li>
      ))}
    </ul>
  );
} 