import Toast from '@/components/Toast';
import useFavoriteStore from '@/hooks/use-favoritestore';
import { usePlaylistStore } from '@/hooks/use-playliststore';
import { useToast } from '@/hooks/useToast';
import { Ionicons } from '@expo/vector-icons';
import { PlaylistItem } from 'iptv-playlist-parser';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PlayerOverlayProps {
  channel: PlaylistItem;
  visible: boolean;
  onClose: () => void;
}

const PlayerOverlay = ({ channel, visible, onClose }: PlayerOverlayProps) => {
  const insets = useSafeAreaInsets();
  const { selectedPlaylist } = usePlaylistStore();
  const { data, addItem, removeItem } = useFavoriteStore();
  const { showToast, hideToast, toastVisible, toastMessage, toastType } = useToast();
  
  // Calculer isFav à partir de data pour que le composant se mette à jour automatiquement
  const isFav = React.useMemo(() => {
    if (!selectedPlaylist) return false;
    return data.some(
      (item) => item.playlistId === selectedPlaylist.id && item.channel.tvg.id === channel.tvg.id
    );
  }, [data, selectedPlaylist, channel.tvg.id]);

  const toggleFavorite = () => {
    if (!selectedPlaylist) return;
    
    if (isFav) {
      removeItem(channel.tvg.id);
      showToast('Removed from favorites', 'success');
    } else {
      addItem({
        id: channel.tvg.id,
        playlistId: selectedPlaylist.id,
        channel,
      });
      showToast('Added to favorites', 'success');
    }
  };

  if (!visible) return null;

  return (
    <>
      <Animated.View 
        entering={FadeIn.duration(200)} 
        exiting={FadeOut.duration(200)}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <View style={styles.channelInfo}>
          <Text style={styles.channelName} numberOfLines={1}>
            {channel.name}
          </Text>
          <Text style={styles.channelGroup}>{channel.group?.title ?? "Unknown"}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={toggleFavorite}>
            <Ionicons name={isFav ? "star" : "star-outline"} size={28} color="#fff" />
          </Pressable>
          <Pressable style={styles.button} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>
        </View>
      </Animated.View>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={hideToast}
        position="top"
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  channelInfo: {
    flex: 1,
    marginRight: 16,
  },
  channelName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  channelGroup: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
  },
});

export default PlayerOverlay;