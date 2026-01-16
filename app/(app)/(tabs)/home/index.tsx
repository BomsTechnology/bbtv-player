import EmptyData from "@/components/EmptyData";
import PlaylistCard from "@/components/card/PlaylistCard";
import SearchInput from "@/components/form/SearchInput";
import { Colors } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { groupPlaylistByCategory } from "@/hooks/usePlalist";
import { useTheme } from "@/hooks/useTheme";
import { playlistService } from "@/services/playlistService";
import { MyCustomPlaylist } from "@/types/playlistType";
import { generateDate } from "@/utils/generateDate";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

const HomeIndex = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const { data, updatePlaylist, removePlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPlaylistByUrl = useMutation({
    mutationFn: (url: string) => playlistService.getPlaylistByUrl(url),
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  // Use useCallback for async handlers
  const handleUpdate = useCallback(
    async (playlist: MyCustomPlaylist) => {
      if (updatingId) return; // Prevent multiple simultaneous updates
      
      setUpdatingId(playlist.id);

      try {
        const freshData = await fetchPlaylistByUrl.mutateAsync(playlist.url!);
        const newPlaylist: MyCustomPlaylist = {
          ...playlist,
          items: groupPlaylistByCategory(freshData.items),
          updatedAt: new Date().toISOString(),
        };

        updatePlaylist(playlist.id, newPlaylist);
        Alert.alert("Success", `${playlist.title} has been refreshed.`);
      } catch (e) {
        // Error handled by mutation onError
        console.error('Update failed:', e);
      } finally {
        setUpdatingId(null);
      }
    },
    [updatingId, fetchPlaylistByUrl, updatePlaylist]
  );

  // Optimize filtered data computation
  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) {
      // Fast path: no search, just sort
      return [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const searchLower = debouncedSearch.toLowerCase().trim();
    return data
      .filter((playlist) => playlist.title.toLowerCase().includes(searchLower))
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [data, debouncedSearch]);

  // Simple callbacks without useMemo
  const handleDeletePlaylist = useCallback(
    (playlist: MyCustomPlaylist) => {
      removePlaylist(playlist.id);
      Alert.alert("Success", "Playlist deleted successfully");
    },
    [removePlaylist]
  );

  const deleteAlert = useCallback(
    (playlist: MyCustomPlaylist) => {
      Alert.alert(
        "Delete Playlist",
        "Are you sure you want to delete this playlist?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { 
            text: "Delete", 
            onPress: () => handleDeletePlaylist(playlist), 
            style: "destructive" 
          },
        ]
      );
    },
    [handleDeletePlaylist]
  );

  // Memoized render function
  const renderItem = useCallback(
    ({ item }: { item: MyCustomPlaylist }) => (
      <PlaylistCard
        loading={updatingId === item.id}
        onUpdate={() => handleUpdate(item)}
        playlist={item}
        updateDate={generateDate(item.updatedAt)}
        createDate={generateDate(item.createdAt)!}
        handleDelete={() => deleteAlert(item)}
      />
    ),
    [updatingId, handleUpdate, deleteAlert]
  );

  // Memoized key extractor
  const keyExtractor = useCallback(
    (item: MyCustomPlaylist) => item.id.toString(),
    []
  );

  // Memoized header component
  const ListHeaderComponent = useMemo(
    () => (
      <View style={[
        styles.headerContainer,
        {
          backgroundColor: isDark ? Colors.backgroundDark : Colors.background,
          shadowColor: isDark ? "#fff" : "#000",
          shadowOpacity: isDark ? 0.1 : 0.25,
        }
      ]}>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search playlists..."
        />
      </View>
    ),
    [search, isDark]
  );

  // Memoized empty component
  const ListEmptyComponent = useMemo(
    () =>
      debouncedSearch ? (
        <EmptyData
          icon="search"
          title="No playlists found"
          description="Try a different search term"
        />
      ) : (
        <EmptyData
          icon="folder-open-outline"
          title="No playlists yet"
          description="Add your first playlist to get started"
          actionLabel="Add Playlist"
          onAction={() => router.push("/home/form/add")}
        />
      ),
    [debouncedSearch, router]
  );

  const handleAddPress = useCallback(() => {
    router.push("/home/form/add");
  }, [router]);

  return (
    <>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          styles.list,
          { backgroundColor: isDark ? Colors.backgroundDark : Colors.gray }
        ]}
        scrollToOverflowEnabled={true}
        stickyHeaderHiddenOnScroll={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        
      />
      <Pressable 
        style={[
          styles.addButton,
          {
            backgroundColor: isDark ? Colors.primaryDark : Colors.primary,
            shadowColor: isDark ? "#fff" : "#000",
            shadowOpacity: isDark ? 0.1 : 0.25,
          }
        ]} 
        onPress={handleAddPress}
      >
        <MaterialIcons name="add" color={Colors.background} size={30} />
      </Pressable>
    </>
  );
};

export default HomeIndex;

const styles = StyleSheet.create({
  list: {
    gap: 10,
    paddingBottom: 20,
    position: "relative",
  },
  headerContainer: {
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 5,
    position: "static",
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    borderRadius: 50,
    padding: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    elevation: 5,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});