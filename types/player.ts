export interface PlayerState {
    paused: boolean;
    loading: boolean;
    error: string | null;
    duration: number;
    currentTime: number;
    showControls: boolean;
    isLandscape: boolean;
  }