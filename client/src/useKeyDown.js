import { useEffect } from 'react';

export default function useKeyDown(active, keyCodes = [], callback) {
  useEffect(() => {
    const onKeyDown = e => {
      if (active && keyCodes.includes(e.which)) {
        callback();
      }
    };
    if (active) document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active, keyCodes, callback]);
}
