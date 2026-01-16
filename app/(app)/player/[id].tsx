import VideoPlayer from '@/components/player/VideoPlayer';
import useFavoriteStore from '@/hooks/use-favoritestore';
import { usePlaylistStore } from '@/hooks/use-playliststore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { PlaylistItem } from 'iptv-playlist-parser';
import { useEffect, useState } from 'react';

export default function PlayerScreen() {
  const router = useRouter();
  const { id, url, favorite } = useLocalSearchParams<{
    id: string;
    url?: string;
    favorite?: string;
  }>();
  const [channel, setChannel] = useState<PlaylistItem | null>(null);
  const { getItem } = useFavoriteStore();
  const { getSelectedChannel, getSelectedChannelByUrl } = usePlaylistStore();
  
  useEffect(() => {
    if(id !== 'undefined') {
      setChannel(getSelectedChannel(id));
     } else if(url){
      setChannel(getSelectedChannelByUrl(url));
     } else if(favorite){
      setChannel(getItem(favorite).channel);
     }
  }, [id, url, favorite, getSelectedChannel, getSelectedChannelByUrl, getItem]);

  if (!channel) {
    return null;
  }

  const handleClose = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.warn('Failed to unlock screen orientation:', error);
    }
    router.back();
  
  }

  return <VideoPlayer channel={channel} onClose={handleClose} />;
}