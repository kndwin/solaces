import { useState, useEffect, useRef } from 'react';

interface Parameters {
  key?: string;
  code?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
}

const checkKeyValidity = (e: KeyboardEvent, params: Parameters) => {
  return (
    e.key == params.key &&
    e.ctrlKey === !!params.ctrlKey &&
    e.metaKey === !!params.metaKey
  );
};

export function useKeyboardPress(params: Parameters, dependencies: any[]) {
  const [isKeyDown, setIsKeyDown] = useState(false);
  const shouldDisableKeyDownUpdate = useRef(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    const isKeyValid = checkKeyValidity(e, params);
    if (isKeyValid) {
      if (params.onKeyDown) {
        params.onKeyDown(e);
      }
      if (!shouldDisableKeyDownUpdate.current) {
        shouldDisableKeyDownUpdate.current = true;
        setIsKeyDown(true);
      }
    }
  };

  useEffect(() => {
    window.document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.document.removeEventListener('keydown', handleKeyDown);
    };
  }, [...dependencies]);

  return isKeyDown;
}
