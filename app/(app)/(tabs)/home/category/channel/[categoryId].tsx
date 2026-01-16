import ChannelCard from "@/components/card/ChannelCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import Toast from '@/components/Toast';
import { Colors } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from '@/hooks/useToast';
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlaylistItem } from "iptv-playlist-parser";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type LayoutItem = { type: "search_bar" | "empty" };
export type ChannelItem = { type: "channel"; data: PlaylistItem };
export type ChannelListItem = LayoutItem | ChannelItem;

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const Channel = () => {
  const { categoryId } = useLocalSearchParams<{
    categoryId: string;
  }>();
  const { isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { getSelectedCategory } = usePlaylistStore();
  const { showToast, hideToast, toastVisible, toastMessage, toastType } = useToast();
  
  const data = useMemo(() => getSelectedCategory(categoryId), [categoryId, getSelectedCategory]);

  const handleOnPress = useCallback((channel: PlaylistItem) => {
    if (!channel.tvg.id && !channel.url) {
      showToast('This channel is not available', 'error');
    } else {
      if(channel.tvg.id ){
        router.push(`/(app)/player/${channel.tvg.id}`);
      }else if(channel.url) {
        router.push(`/(app)/player/undefined?url=${channel.url}`);
      }
    }
  }, [showToast, router]);

  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    if (!debouncedSearch.trim()) return data.items;
    
    const searchLower = debouncedSearch.toLowerCase().trim();
    return data.items.filter((item) =>
      item.name.toLowerCase().includes(searchLower)
    );
  }, [debouncedSearch, data?.items]);

  const listData: ChannelListItem[] = useMemo(() => {
    const header: LayoutItem = { type: "search_bar" };
    const empty: LayoutItem = { type: "empty" };

    const items: ChannelItem[] = filteredData.map((item) => ({
      type: "channel",
      data: item,
    }));

    return filteredData.length === 0 ? [header, empty] : [header, ...items];
  }, [filteredData]);

  const renderItem = useCallback(({ item, index }: { item: ChannelListItem; index: number }) => {
    if (item.type === "search_bar") {
      return (
        <View style={[styles.headerContainer,{
          backgroundColor: isDark ? Colors.backgroundDark : Colors.background,
          shadowColor: isDark ? "#fff" : "#000",
          shadowOpacity: isDark ? 0.1 : 0.25,
        }]}>
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
    
    const channelData = (item as ChannelItem).data;
    return (
      <View style={styles.item}>
        <ChannelCard 
          channel={channelData} 
          onPress={() => handleOnPress(channelData)} 
        />
      </View>
    );
  }, [isDark, search, handleOnPress]);

  const keyExtractor = useCallback((item: ChannelListItem, index: number) => {
    if (item.type === "search_bar") return "header";
    if (item.type === "empty") return "empty";
    const channelItem = item as ChannelItem;
    return channelItem.data.tvg.id || `channel-${index}`;
  }, []);

  const overrideItemLayout = useCallback((layout: any, item: ChannelListItem) => {
    if (item.type === "search_bar" || item.type === "empty") {
      layout.span = 3;
    } 
  }, []);

  const getItemType = useCallback((item: ChannelListItem) => {
    return item.type;
  }, []);

  return (
    <>
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.list, { backgroundColor: isDark ? Colors.backgroundDark : Colors.gray }]}
        scrollToOverflowEnabled={true}
        stickyHeaderHiddenOnScroll={false}
        numColumns={3}
        overrideItemLayout={overrideItemLayout}
        stickyHeaderIndices={[0]}
        drawDistance={CARD_HEIGHT * 6}
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
  list: {
    paddingBottom: 20,
    backgroundColor: Colors.gray,
  },
  item: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
  },
});
