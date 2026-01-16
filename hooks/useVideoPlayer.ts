import type { PlayerState } from '@/types/player';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useVideoPlayer = () => {
  const [state, setState] = useState<PlayerState>({
    paused: false,
    loading: true,
    error: null,
    duration: 0,
    currentTime: 0,
    showControls: true,
    isLandscape: false,
  });

  const controlsTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setState(prev => ({ ...prev, paused }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }));
  }, []);

  const setCurrentTime = useCallback((currentTime: number) => {
    setState(prev => ({ ...prev, currentTime }));
  }, []);

  const setShowControls = useCallback((showControls: boolean) => {
    setState(prev => ({ ...prev, showControls }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState(prev => ({ ...prev, paused: !prev.paused, showControls: true }));
  }, []);

  const toggleControls = useCallback(() => {
    setState(prev => ({ ...prev, showControls: !prev.showControls }));
  }, []);

  const toggleOrientation = useCallback(async () => {
    // Determine the target orientation first
    const targetIsLandscape = !state.isLandscape;
    const targetLock = targetIsLandscape 
      ? ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
      : ScreenOrientation.OrientationLock.PORTRAIT_UP;
  
    try {
      // 1. Attempt the native lock first
      await ScreenOrientation.lockAsync(targetLock);
      
      // 2. Only update state if the native lock succeeds
      setState(prev => ({ ...prev, isLandscape: targetIsLandscape }));
    } catch (error) {
      console.warn('Orientation lock failed, falling back to unlock:', error);
      
      // 3. If locking fails, unlock to allow the user to rotate manually
      try {
        await ScreenOrientation.unlockAsync();
      } catch (unlockError) {
        console.error('Unlock failed:', unlockError);
      }
    }
  }, [state.isLandscape]);

  // Auto-hide contrôles
  useEffect(() => {
    if (state.showControls && !state.paused) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [state.showControls, state.paused, setShowControls]);

  return {
    state,
    setLoading,
    setError,
    setPaused,
    setDuration,
    setCurrentTime,
    setShowControls,
    togglePlayPause,
    toggleControls,
    toggleOrientation,
  };
};