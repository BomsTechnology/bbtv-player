import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Image } from "expo-image";
import { PlaylistItem } from "iptv-playlist-parser";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PlaylistCard = ({ channel, onPress }: { channel: PlaylistItem, onPress: () => void }) => {
  const { isDark } = useTheme();

  return (
    <Pressable 
      style={[
        styles.container,
        {
          backgroundColor: isDark ? Colors.darkDark : Colors.background,
          borderColor: isDark ? Colors.lightDark : Colors.gray,
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.rightBlock}>
        {(channel.tvg.logo ? (
          <Image
            source={{ uri: channel.tvg.logo }}
            style={styles.image}
            contentFit="contain"
          />
        ) : (
          <Image
            source={isDark 
              ? require("@/assets/icons/ios-dark.png")  // Créez une version sombre
              : require("@/assets/icons/ios-light.png")}
            contentFit="contain"
            style={styles.image}
          />
        ))}
      </View>
      <View style={styles.middleBlock}>
        <Text 
          style={[
            styles.title,
            { color: isDark ? Colors.textDark : Colors.text }
          ]} 
          numberOfLines={1}
        >
          {channel.name}
        </Text>
        <Text 
          style={[
            styles.detail,
            { color: isDark ? Colors.mutedDark : Colors.muted }
          ]} 
          numberOfLines={1}
        >
          {channel.group.title}
        </Text>
      </View>
    </Pressable>
  );
};

export default PlaylistCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.brandBold,
  },
  detail: {
    fontSize: 14,
    fontFamily: Fonts.brand,
  },
  leftBlock: {},
  middleBlock: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 3,
  },
  rightBlock: {},
  image: {
    width: 100,
    height: 60,
  },
});