import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { MyCustomPlaylist } from "@/types/playlistType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PlaylistCard = ({ playlist }: { playlist: MyCustomPlaylist }) => {
  const { setSelectedPlaylist, removePlaylist } = usePlaylistStore();
  const router = useRouter();
  const createDate = new Date(playlist.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const updateDate = playlist.updatedAt ? new Date(playlist.updatedAt).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) : null;
  const handleSelectedPlaylist = useCallback(() => {
    setSelectedPlaylist(playlist);
    router.push("/home/category");
  }, [playlist, setSelectedPlaylist, router]);

  const handleDeletePlaylist = useCallback(() => {
    removePlaylist(playlist.id);
    Alert.alert("Success", "Playlist deleted successfully");
  }, [playlist.id, removePlaylist]);

  const deleteAlert = useCallback(() =>
    Alert.alert('Delete Playlist', 'Are you sure you want to delete this playlist?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Delete', onPress: handleDeletePlaylist},
    ]),[handleDeletePlaylist]);

  return (
        <View style={styles.container} >
          <TouchableOpacity onPress={handleSelectedPlaylist} style={styles.middleBlock}>
            <Text style={styles.title}>{playlist.title}</Text>
            <Text style={styles.detail} numberOfLines={1}>
              Channels: {playlist.items[0]?.items?.length || 0} | Added: {createDate} 
              {updateDate && ` | Updated: ${updateDate}`}
            </Text>
          </TouchableOpacity>
          <View style={styles.rightBlock}>
            {playlist.type === "url" && <TouchableOpacity>
              <MaterialIcons name="refresh" color={Colors.text} size={24} />
            </TouchableOpacity>}
            <TouchableOpacity onPress={() => router.push(`/home/form/${playlist.id}`)}>
              <MaterialIcons name="edit" color={Colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="delete" color={Colors.text} size={24} onPress={deleteAlert} />
            </TouchableOpacity>
          </View>
        </View>
  );
};

export default PlaylistCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.0,
    elevation: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
    color: Colors.text,
  },
  detail: {
    fontSize: 14,
    fontFamily: Fonts.brand,
    color: Colors.muted,
  },
  leftBlock: {},
  middleBlock: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 15
  },
  rightBlock: {
    flexDirection: "row",
    gap: 5,
    paddingVertical: 15,
    paddingRight: 15
  },
});
