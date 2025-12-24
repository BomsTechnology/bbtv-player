import ChannelCard from "@/components/card/ChannelCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import { Colors, Fonts } from "@/constants/theme";
import useFavoriteStore from "@/hooks/use-favoritestore";
import { useDebounce } from "@/hooks/useDebounce";
import { FlashList } from "@shopify/flash-list";
import { PlaylistItem } from "iptv-playlist-parser";
import { useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type LayoutItem = { type: "search_bar" | "empty" };
export type ChannelItem = { type: "channel"; data: PlaylistItem };
export type ChannelListItem = LayoutItem | ChannelItem;

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const FavoriteIndex = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { data: favorites } = useFavoriteStore();

  // Extraire tous les channels des favoris
  const favoriteChannels = useMemo(() => {
    return favorites.map((favorite) => favorite.channel);
  }, [favorites]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return favoriteChannels;
    const searchLower = debouncedSearch.toLowerCase().trim();
    return favoriteChannels.filter((item) =>
      item.name.toLowerCase().includes(searchLower)
    );
  }, [debouncedSearch, favoriteChannels]);

  const listData: ChannelListItem[] = useMemo(() => {
    const header: LayoutItem = { type: "search_bar" };
    const empty: LayoutItem = { type: "empty" };

    const items: ChannelItem[] = (filteredData || []).map((item) => ({
      type: "channel",
      data: item,
    }));

    return filteredData.length === 0 ? [header, empty] : [header, ...items];
  }, [filteredData]);

  return (
    <>
      <FlashList
        data={listData}
        renderItem={({ item, index }) => {
          if (item.type === "search_bar") {
            return (
              <View style={styles.headerContainer}>
                <SearchInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search favorites..."
                />
              </View>
            );
          } else if (item.type === "empty") {
            return (
              <EmptyData
                icon={favorites.length === 0 ? "star-outline" : "search"}
                title={
                  favorites.length === 0
                    ? "No favorites yet"
                    : "No channels found"
                }
                description={
                  favorites.length === 0
                    ? "Add channels to your favorites to see them here"
                    : "Try a different search term"
                }
              />
            );
          }
          return (
            <View style={styles.item}>
              <ChannelCard channel={(item as ChannelItem).data!} />
            </View>
          );
        }}
        keyExtractor={(item, index) => {
          if (item.type === "channel") {
            return (item as ChannelItem).data.tvg.id || index.toString();
          }
          return index.toString();
        }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        scrollToOverflowEnabled={true}
        stickyHeaderHiddenOnScroll={false}
        numColumns={3}
        overrideItemLayout={(layout, item) => {
          if (item.type === "search_bar" || item.type === "empty") {
            layout.span = 3;
          }
        }}
        stickyHeaderIndices={[0]}
      />
    </>
  );
};

export default FavoriteIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 20,
    backgroundColor: Colors.gray,
    position: "relative",
  },
  item: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: Colors.background,
    position: "static",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: Fonts.brand,
  },
});