import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { useKeepAwake } from 'expo-keep-awake';
import { PlaylistItem } from 'iptv-playlist-parser';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import Video, { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';
import PlayerControls from './PlayerControls';
import PlayerOverlay from './PlayerOverlay';

interface VideoPlayerProps {
  channel: PlaylistItem;
  onClose: () => void;
}

const VideoPlayer = ({ channel, onClose }: VideoPlayerProps) => {
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const videoRef = useRef<VideoRef>(null);
  const [seeking, setSeeking] = useState(false);
  
  const {
    state,
    setLoading,
    setError,
    setDuration,
    setCurrentTime,
    togglePlayPause,
    toggleControls,
    toggleOrientation,
  } = useVideoPlayer();

  useKeepAwake();

  useEffect( () => {
        setWidth(Dimensions.get('window').width);
        setHeight(Dimensions.get('window').height);
  }, [state]);

  const handleLoad = (data: OnLoadData) => {
    setLoading(false);
    setDuration(data.duration);
  };

  const handleProgress = (data: OnProgressData) => {
    if (!seeking) {
      setCurrentTime(data.currentTime);
      if (data.currentTime > state.duration && state.duration > 0) {
        setDuration(data.currentTime);
      }
    }
  };

  const handleError = () => {
    setError('Failed to load stream');
  };

  const handleSeek = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
    setSeeking(false);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(state.currentTime + 10, state.duration);
    handleSeek(newTime);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(state.currentTime - 10, 0);
    handleSeek(newTime);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Video */}
      <Video
        ref={videoRef}
        source={{ uri: channel.url }}
        style={{ ...styles.video, width, height }}
        resizeMode={'contain'}
        paused={state.paused}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onBuffer={(data) => setLoading(data.isBuffering)}
        onError={handleError}
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
      />

      {/* Overlay avec infos de la chaîne */}
      <PlayerOverlay
        channel={channel}
        visible={state.showControls}
        onClose={onClose}
      />

      {/* Contrôles */}
      <PlayerControls
        visible={state.showControls}
        paused={state.paused}
        loading={state.loading}
        error={state.error}
        duration={state.duration}
        currentTime={state.currentTime}
        isLandscape={state.isLandscape}
        onPlayPause={togglePlayPause}
        onSeek={handleSeek}
        onSkipForward={handleSkipForward}
        onSkipBackward={handleSkipBackward}
        onToggleControls={toggleControls}
        onToggleOrientation={toggleOrientation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    
  },
});

export default VideoPlayer;
