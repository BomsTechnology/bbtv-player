import { Colors, Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import { PlaylistItem } from "iptv-playlist-parser";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PlaylistCard = ({ channel, onPress }: { channel: PlaylistItem, onPress: () => void }) => {

  return (
      <Pressable style={styles.container} onPress={onPress}>
        <View style={styles.rightBlock}>
          {(channel.tvg.logo ? (
            <Image
              source={{ uri: channel.tvg.logo }}
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <Image
              source={require("@/assets/icons/ios-light.png")}
              contentFit="contain"
              style={styles.image}
            />
          ))}
        </View>
        <View style={styles.middleBlock}>
          <Text style={styles.title} numberOfLines={1}>{channel.name}</Text>
          <Text style={styles.detail} numberOfLines={1}>{channel.group.title}</Text>
        </View>
      </Pressable>
  );
};

export default PlaylistCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.gray,
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 18,
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
