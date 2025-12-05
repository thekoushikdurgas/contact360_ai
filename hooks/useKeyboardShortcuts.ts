
import { useEffect, useState, useCallback } from 'react';

interface ShortcutConfig {
  onSearch: () => void;
  onOpenHelp: () => void;
  onNavigate: (path: string) => void;
  onClose: () => void;
}

export const useKeyboardShortcuts = ({ onSearch, onOpenHelp, onNavigate, onClose }: ShortcutConfig) => {
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState<number>(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input, textarea, or contentEditable
    const target = e.target as HTMLElement;
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;

    // --- Global High Priority Shortcuts (Work even inside inputs) ---
    
    // CMD/CTRL + K: Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      onSearch();
      return;
    }

    // Escape: Close modals / Blur inputs
    if (e.key === 'Escape') {
      if (isInput) {
        target.blur();
      } else {
        onClose();
      }
      return;
    }

    // Stop here if user is typing
    if (isInput) return;

    // --- Navigation & Action Shortcuts (Only when not typing) ---

    // Shift + ?: Help
    if (e.key === '?' && e.shiftKey) {
      e.preventDefault();
      onOpenHelp();
      return;
    }

    const now = Date.now();
    const CHORD_TIMEOUT = 1000; // 1 second to complete a chord

    // Handle "g" chords (Go to...)
    if (e.key === 'g' && (!lastKey || (now - lastKeyTime > CHORD_TIMEOUT))) {
      setLastKey('g');
      setLastKeyTime(now);
      return;
    }

    if (lastKey === 'g' && (now - lastKeyTime <= CHORD_TIMEOUT)) {
      // Reset chord
      setLastKey(null);
      
      switch (e.key) {
        case 'd': onNavigate('/'); break;          // Dashboard
        case 'c': onNavigate('/contacts'); break;  // Contacts
        case 'o': onNavigate('/companies'); break; // Companies (Orgs)
        case 'f': onNavigate('/finder'); break;    // Finder
        case 'v': onNavigate('/verifier'); break;  // Verifier
        case 'b': onNavigate('/billing'); break;   // Billing
        case 's': onNavigate('/settings'); break;  // Settings
        case 'l': onNavigate('/linkedin'); break;  // LinkedIn
        case 'a': onNavigate('/ai-chat'); break;   // AI Chat
        default: break;
      }
    }
  }, [lastKey, lastKeyTime, onSearch, onOpenHelp, onNavigate, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
