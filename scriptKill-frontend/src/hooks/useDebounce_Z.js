import { useCallback, useRef } from 'react';

export const useDebounce = (fn, delay = 300) => {
  const timerRef = useRef(null);

  return useCallback((...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      fn(...args);
      timerRef.current = null;
    }, delay);
  }, [fn, delay]);
};