import { useEffect, useState } from 'react';

export function useToast(duration = 3000) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(''), duration);
    return () => window.clearTimeout(timer);
  }, [message, duration]);

  return { message, showToast: setMessage };
}
