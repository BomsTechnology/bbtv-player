import { CategoryList, MyCustomPlaylist } from '@/types/playlistType';
import zustandStorage from '@/utils/zustandStorage';
import { PlaylistItem } from 'iptv-playlist-parser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useFavoriteStore from './use-favoritestore';

export interface PlayListStore {
    data: MyCustomPlaylist[],
    selectedPlaylist?: MyCustomPlaylist,
    getSelectedCategory: (category: string) => CategoryList,
    setSelectedPlaylist: (playlist: MyCustomPlaylist) => void,
    getSelectedPlaylist: () => MyCustomPlaylist,
    addPlaylist: (playlist: MyCustomPlaylist) => void,
    removePlaylist: (id: string) => void,
    getSelectedChannel: (id: string) => PlaylistItem,
    getPlaylist: (id: string) => MyCustomPlaylist,
    updatePlaylist: (id: string, playlist: MyCustomPlaylist) => void,
}

export const usePlaylistStore = create<PlayListStore>()(
    persist(
        (set, get) => (
        {    
            data: [],
            addPlaylist: (playlist: MyCustomPlaylist) => {
                set((state) => ({ data: [...state.data, playlist] }));
            },
            removePlaylist: (id: string) => {
                useFavoriteStore.getState().clearByPlaylistId(id);
                set((state) => ({ data: state.data.filter((playlist) => playlist.id !== id) }));
            },
            setSelectedPlaylist: (playlist: MyCustomPlaylist) => {
                set({ selectedPlaylist: playlist });
            },
            getSelectedCategory: (category: string) => {
                return get().selectedPlaylist!.items.find((item) => item.category === category)!;
            },
            getSelectedChannel: (id: string) => {
                return get().selectedPlaylist!.items[0].items?.find((item) => item.tvg.id === id)!;
            },
            getPlaylist: (id: string) => {
                return get().data.find((playlist) => playlist.id === id)!;
            },
            updatePlaylist: (id: string, playlist: MyCustomPlaylist) => {
                set((state) => ({ data: state.data.map((item) => item.id === id ? playlist : item) }));
            },
            getSelectedPlaylist: () => {
                return get().selectedPlaylist!;
            },
        }
        ),
        {
          name: 'playlist',
          storage: createJSONStorage(() => zustandStorage),
        }
      )
  );