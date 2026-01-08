import zustandStorage from '@/utils/zustandStorage';
import { PlaylistItem } from 'iptv-playlist-parser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoriteItem {
    id: string;
    playlistId: string;
    channel: PlaylistItem;
}

interface FavoriteStore {
    data: FavoriteItem[];
    addItem: (item: FavoriteItem) => void;
    removeItem: (id: string) => void;
    isFavorite: (tvgId: string, playlistId: string) => boolean;
    clearByPlaylistId: (playlistId: string) => void;
    getData: () => FavoriteItem[]
}

const useFavoriteStore = create<FavoriteStore>()(
    persist(
        (set, get) => ({
            data: [],
            addItem: (item: FavoriteItem) => {
                set((state) => ({ data: [...state.data, item] }));
            },
            removeItem: (id: string) => {
                set((state) => ({ data: state.data.filter((item) => item.id !== id) }));
            },
            isFavorite: (tvgId: string, playlistId: string) => {
                return get().data.some((item) => item.playlistId === playlistId && item.channel.tvg.id === tvgId);
            },
            getData: () => get().data,
            clearByPlaylistId: (playlistId: string) => {
                set((state) => ({ 
                    data: state.data.filter((item) => item.playlistId !== playlistId) 
                }));
            },
        }),
        {
            name: 'favorite-store',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);

export default useFavoriteStore;