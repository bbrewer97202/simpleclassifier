import { useEffect } from 'react';

interface useKeyDownFn {
  (active: boolean | null, keyCodes: number[] | never, callback: Function): void;
}

const useKeyDown: useKeyDownFn = (active, keyCodes = [], callback) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (active && keyCodes.includes(e.keyCode)) {
        callback();
      }
    };
    if (active) document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [active, keyCodes, callback]);
};

export default useKeyDown;
