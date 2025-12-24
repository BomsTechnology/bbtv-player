import VideoPlayer from '@/components/player/VideoPlayer';
import { usePlaylistStore } from '@/hooks/use-playliststore';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

  return <VideoPlayer channel={channel} onClose={() => router.back()} />;
}