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

  const toggleOrientation = useCallback(async (orientation?: 'portrait' | 'landscape') => {
    try {
      if (state.isLandscape) {
        setState(prev => ({ ...prev, isLandscape: false }));
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      } else {
        setState(prev => ({ ...prev, isLandscape: true }));
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      }
    } catch (error) {
      console.log('Orientation toggle failed:', error);
      
      setState(prev => ({ ...prev, isLandscape: !prev.isLandscape }));
      
      try {
        await ScreenOrientation.unlockAsync();
      } catch (unlockError) {
        console.log('Unlock failed:', unlockError);
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
  }, [state.showControls, state.paused]);

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