import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { MyCustomPlaylist } from "@/types/playlistType";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PlaylistCardProps {
  playlist: MyCustomPlaylist;
  onUpdate: () => void;
  loading: boolean;
  updateDate?: string;
  createDate: string;
  handleDelete: () => void;
}

const PlaylistCard = ({
  playlist,
  onUpdate,
  loading,
  updateDate,
  createDate,
  handleDelete,
}: PlaylistCardProps) => {
  const router = useRouter();
  const { isDark } = useTheme();
  const channelCount = playlist.items[0]?.items?.length || 0;

  const handlePress = useCallback(() => {
    // Précharger juste avant la navigation (sans latence ajoutée)
    router.prefetch(`/(app)/(tabs)/home/category/${playlist.id}`);
    // Navigation immédiate après
    router.push({
      pathname: "/(app)/(tabs)/home/category/[playlistId]",
      params: { playlistId: playlist.id },
    });
  }, [playlist.id, router]);

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: isDark ? Colors.darkDark : Colors.background,
        shadowColor: isDark ? "#fff" : "#000",
        shadowOpacity: isDark ? 0.1 : 0.25,
      }
    ]}>
      <Link
        href={{
          pathname: "/(app)/(tabs)/home/category/[playlistId]",
          params: { playlistId: playlist.id },
        }}
        asChild
      ></Link>
        <Pressable style={styles.middleBlock} onPress={handlePress} unstable_pressDelay={0}>
          <Text style={[
            styles.title,
            { color: isDark ? Colors.textDark : Colors.text }
          ]} numberOfLines={1}>
            {playlist.title}
          </Text>
          {loading ? (
            <Text style={[
              styles.detail,
              { color: isDark ? Colors.mutedDark : Colors.muted }
            ]} numberOfLines={1}>
              Loading...
            </Text>
          ) : (
            <Text style={[
              styles.detail,
              { color: isDark ? Colors.mutedDark : Colors.muted }
            ]} numberOfLines={1}>
              Channels: {channelCount}
              {updateDate && ` | Updated: ${updateDate}`} | Added: {createDate}
            </Text>
          )}
        </Pressable>
      
      <View style={styles.rightBlock}>
        {playlist.type === "url" && (
          <Pressable 
            onPress={onUpdate}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={loading}
            unstable_pressDelay={0}
          >
            <MaterialIcons 
              name="refresh" 
              color={loading 
                ? (isDark ? Colors.mutedDark : Colors.muted) 
                : (isDark ? Colors.textDark : Colors.text)
              } 
              size={24} 
            />
          </Pressable>
        )}
        <Link
          href={{
            pathname: "/(app)/(tabs)/home/form/[id]",
            params: { id: playlist.id },
          }}
          asChild
        >
          <Pressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} unstable_pressDelay={0}>
            <MaterialIcons 
              name="edit" 
              color={isDark ? Colors.textDark : Colors.text} 
              size={24} 
            />
          </Pressable>
        </Link>
        <Pressable 
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          unstable_pressDelay={0}
        >
          <MaterialIcons 
            name="delete" 
            color={isDark ? Colors.textDark : Colors.text} 
            size={24} 
          />
        </Pressable>
      </View>
    </View>
  );
};

export default memo(PlaylistCard, (prevProps, nextProps) => {
  return (
    prevProps.playlist.id === nextProps.playlist.id &&
    prevProps.playlist.title === nextProps.playlist.title &&
    prevProps.playlist.updatedAt === nextProps.playlist.updatedAt &&
    prevProps.loading === nextProps.loading &&
    prevProps.updateDate === nextProps.updateDate &&
    prevProps.createDate === nextProps.createDate &&
    prevProps.playlist.items[0]?.items?.length === nextProps.playlist.items[0]?.items?.length
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1.0,
    elevation: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
  },
  detail: {
    fontSize: 14,
    fontFamily: Fonts.brand,
  },
  middleBlock: {
    flex: 1,
    paddingVertical: 15,
    paddingLeft: 15,
  },
  rightBlock: {
    flexDirection: "row",
    gap: 5,
    paddingVertical: 15,
    paddingRight: 15,
    alignItems: "center",
  },
});