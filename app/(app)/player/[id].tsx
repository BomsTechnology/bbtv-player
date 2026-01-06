import VideoPlayer from '@/components/player/VideoPlayer';
import { usePlaylistStore } from '@/hooks/use-playliststore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { getSelectedChannel } = usePlaylistStore();
  const channel = getSelectedChannel(id);



  if (!channel) {
    //router.back();
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