import EmptyData from "@/components/EmptyData";
import PlaylistCard from "@/components/card/PlaylistCard";
import SearchInput from "@/components/form/SearchInput";
import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { groupPlaylistByCategory } from "@/hooks/usePlalist";
import { playlistService } from "@/services/playlistService";
import { MyCustomPlaylist } from "@/types/playlistType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
const HomeIndex = () => {
  const router = useRouter();
  const { updatePlaylist } = usePlaylistStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data } = usePlaylistStore();

  const fetchPlaylistByUrl = useMutation({
    mutationFn: (url: string) => playlistService.getPlaylistByUrl(url),
    onError: (error) => {
      Alert.alert("Error", error.message);
    }
  });

  const handleUpdate = async (playlist: MyCustomPlaylist) => {
    const data = await fetchPlaylistByUrl.mutateAsync(playlist.url!)
    const newPlaylist : MyCustomPlaylist = {
      ...playlist,
      items: groupPlaylistByCategory(data.items),
      updatedAt: new Date().toISOString(),
    }

    updatePlaylist(playlist.id, newPlaylist)
    Alert.alert("Success", "Playlist updated successfully");
  }



  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data;
    const searchLower = debouncedSearch.toLowerCase().trim();
    const ndata = data.filter((playlist) =>
      playlist.title.toLowerCase().includes(searchLower)
    );
    return  ndata.reverse();
  }, [data, debouncedSearch]);

  return (
    <>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <PlaylistCard loading={fetchPlaylistByUrl.isPending} onUpdate={() => handleUpdate(item)} playlist={item} />}
        keyExtractor={(item, index) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        scrollToOverflowEnabled={true}
        stickyHeaderHiddenOnScroll={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search playlists..."
            />
          </View>
        }
        ListEmptyComponent={
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
              onAction={() => router.push('/home/form/')}
            />
          )
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/home/form/add') }>
        <MaterialIcons name="add" color={Colors.background} size={30} />
      </TouchableOpacity>
    </>
  );
};
export default HomeIndex;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    gap: 10,
    paddingBottom: 20,
    backgroundColor: Colors.gray,
    position: "relative",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "static",
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.brand,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray,
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.brand,
    color: Colors.text,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
