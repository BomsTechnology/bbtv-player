import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface PlayerControlsProps {
  visible: boolean;
  paused: boolean;
  loading: boolean;
  error: string | null;
  duration: number;
  currentTime: number;
  isLandscape: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onToggleControls: () => void;
  onToggleOrientation: () => void;
}

const PlayerControls = ({
  visible,
  paused,
  loading,
  error,
  duration,
  currentTime,
  isLandscape,
  onPlayPause,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onToggleControls,
  onToggleOrientation,
}: PlayerControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#fff" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!visible) {
    return (
      <Pressable
        style={styles.tapZone}
        onPress={onToggleControls}
      />
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.controlsContainer}
    >
      {/* Overlay sombre */}
      <Pressable
        style={styles.overlay}
        onPress={onToggleControls}
      />

      {/* Contrôles centraux */}
      <View style={styles.centerControls}>
        <Pressable style={styles.controlButton} onPress={onSkipBackward}>
          <Ionicons name="play-back" size={40} color="#fff" />
          <Text style={styles.skipText}>10s</Text>
        </Pressable>

        <Pressable style={styles.playPauseButton} onPress={onPlayPause}>
          <Ionicons name={paused ? 'play' : 'pause'} size={64} color="#fff" />
        </Pressable>

        <Pressable style={styles.controlButton} onPress={onSkipForward}>
          <Ionicons name="play-forward" size={40} color="#fff" />
          <Text style={styles.skipText}>10s</Text>
        </Pressable>
      </View>

      <View style={styles.bottomControls}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={Math.max(duration, currentTime) || 1}
          value={currentTime}
          disabled={duration === 0 && currentTime === 0}
          onSlidingComplete={onSeek}
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="rgba(255,255,255,0.3)"
          thumbTintColor="#fff"
        />
        <View style={styles.controlsRow}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
            {formatTime(currentTime)}
            {duration > 0 ? ` / ${formatTime(duration)}` : ' / --:--'}
            </Text>
          </View>

          <Pressable 
            style={styles.orientationButton} 
            onPress={onToggleOrientation}
          >
            <MaterialCommunityIcons 
              name="phone-rotate-portrait"
              size={24} 
              color="#fff" 
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tapZone: {
    ...StyleSheet.absoluteFillObject,
  },
  controlsContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  centerControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    zIndex: 10,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'none',
  },
  playPauseButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  orientationButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
  },
});

export default PlayerControls;