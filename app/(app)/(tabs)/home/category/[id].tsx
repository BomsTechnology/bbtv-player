import ChannelCard from "@/components/card/ChannelCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import Toast from '@/components/Toast';
import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from '@/hooks/useToast';
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlaylistItem } from "iptv-playlist-parser";
import { useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type LayoutItem = { type: "search_bar" | "empty" };
export type ChannelItem = { type: "channel"; data: PlaylistItem };
export type ChannelListItem = LayoutItem | ChannelItem;

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const Channel = () => {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { getSelectedCategory } = usePlaylistStore();
  const { showToast, hideToast, toastVisible, toastMessage, toastType } = useToast();
  const data = getSelectedCategory(id);

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return data.items || [];
    const searchLower = debouncedSearch.toLowerCase().trim();
    return data?.items
      ? data?.items.filter((item) =>
          item.name.toLowerCase().includes(searchLower)
        )
      : [];
  }, [debouncedSearch, data.items]);

  const listData: ChannelListItem[] = useMemo(() => {
    const header: LayoutItem = { type: "search_bar" };
    const empty: LayoutItem = { type: "empty" };

    const items: ChannelItem[] = (filteredData || []).map((item) => ({
      type: "channel",
      data: item,
    }));

    return filteredData.length === 0 ? [header, empty] : [header, ...items];
  }, [filteredData]);

  const handleOnPress = (channel: PlaylistItem) => {
    if(!channel.tvg.id){
      showToast('This channel is not available', 'error');
    } else {
      router.push(`/(app)/player/${channel.tvg.id}`)
    }
  }

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
                  placeholder="Search channel..."
                />
              </View>
            );
          } else if (item.type === "empty") {
            return (
              <EmptyData
                icon="search"
                title="No channels found"
                description="Try a different search term"
              />
            );
          }
          return (
            <View style={styles.item}>
              <ChannelCard channel={(item as ChannelItem).data!} onPress={() => handleOnPress((item as ChannelItem).data)} />
            </View>
          );
        }}
        keyExtractor={(item, index) => {
          if (item.type === "search_bar") return "header";
          if (item.type === "empty") return "empty";
          return `${(item as ChannelItem).data.name}-${index}`;
        }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        //columnWrapperStyle={styles.row}
        scrollToOverflowEnabled={true}
        //ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        stickyHeaderHiddenOnScroll={false}
        numColumns={3}
        overrideItemLayout={(layout, item) => {
          if (item.type === "search_bar" || item.type === "empty") {
            layout.span = 3;
          }
        }}
        stickyHeaderIndices={[0]}
      />
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={hideToast}
        position="top"
      />
    </>
  );
};

export default Channel;

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
