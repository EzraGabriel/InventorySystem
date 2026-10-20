import { Check } from 'lucide-react';

export function Toast({ message }) {
  if (!message) return null;
  return <div className="toast"><Check aria-hidden="true" /><span>{message}</span></div>;
}
