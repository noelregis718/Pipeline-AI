'use client';
import { useEffect, useState } from 'react';

export const announce = (message: string) => {
  const event = new CustomEvent('aria-announce', { detail: message });
  window.dispatchEvent(event);
};

export default function AriaAnnouncer() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAnnounce = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setMessage(customEvent.detail);
      setTimeout(() => setMessage(''), 3000); // clear after reading
    };
    window.addEventListener('aria-announce', handleAnnounce);
    return () => window.removeEventListener('aria-announce', handleAnnounce);
  }, []);

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      style={{ 
        position: 'absolute', 
        width: 1, 
        height: 1, 
        padding: 0, 
        margin: -1, 
        overflow: 'hidden', 
        clip: 'rect(0,0,0,0)', 
        whiteSpace: 'nowrap', 
        border: 0 
      }}
    >
      {message}
    </div>
  );
}
