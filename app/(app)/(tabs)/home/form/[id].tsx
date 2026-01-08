import AddForm from "@/components/form/AddForm";
import EditForm from "@/components/form/EditForm";
import { Colors } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Add() {
  const router = useRouter();
  const { getPlaylist } = usePlaylistStore();
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const playlist = getPlaylist(id);

  if (id !== "add" && !playlist) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.closeBtn}
        onPress={() => router.dismiss()}
      >
        <Ionicons name="close" size={22} />
      </Pressable>
      { id !== "add" ?
        <EditForm  playlist={playlist} /> :
        <AddForm />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
  },
  closeBtn: {
    backgroundColor: Colors.light,
    borderRadius: 40,
    padding: 6,
    alignSelf: "flex-end",
  },
});
