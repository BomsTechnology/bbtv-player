import ChannelCard from "@/components/card/ChannelCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import Toast from '@/components/Toast';
import { Colors, Fonts } from "@/constants/theme";
import useFavoriteStore, { FavoriteItem } from "@/hooks/use-favoritestore";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from '@/hooks/useToast';
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

export type LayoutItem = { type: "search_bar" | "empty" };
export type ChannelItem = { type: "channel"; data: FavoriteItem };
export type ChannelListItem = LayoutItem | ChannelItem;

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH / 3;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const FavoriteIndex = () => {
  const { isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { showToast, hideToast, toastVisible, toastMessage, toastType } = useToast();
  const debouncedSearch = useDebounce(search, 300);
  const { data: favorites } = useFavoriteStore();

  const filteredData = useMemo(() => {
    if (!debouncedSearch.trim()) return favorites;
    
    const searchLower = debouncedSearch.toLowerCase().trim();
    return favorites.filter((item) =>
      item.channel.name.toLowerCase().includes(searchLower)
    );
  }, [debouncedSearch, favorites]);

  const listData: ChannelListItem[] = useMemo(() => {
    const header: LayoutItem = { type: "search_bar" };
    const empty: LayoutItem = { type: "empty" };

    const items: ChannelItem[] = (filteredData || []).map((item) => ({
      type: "channel",
      data: (item as FavoriteItem),
    }));

    return filteredData.length === 0 ? [header, empty] : [header, ...items];
  }, [filteredData]);

  const handleOnPress = useCallback((item: ChannelItem) => {
    if (!item.data.channel.tvg.id && !item.data.channel.url) {
      showToast('This channel is not available', 'error');
    } else {
        router.push(`/(app)/player/undefined?favorite=${item.data.id}`);
    }
  }, [showToast, router]);

  const renderItem = useCallback(({ item, index }: { item: ChannelListItem; index: number }) => {
    if (item.type === "search_bar") {
      return (
        <View style={[styles.headerContainer,
          {
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
    
    const channelData = (item as ChannelItem);
    return (
      <View style={styles.item}>
        <ChannelCard 
          channel={channelData.data.channel} 
          onPress={() => handleOnPress(channelData)} 
        />
      </View>
    );
  }, [isDark, search, handleOnPress]);

  const keyExtractor = useCallback((item: ChannelListItem, index: number) => {
    if (item.type === "search_bar") return "header";
    if (item.type === "empty") return "empty";
    const channelItem = item as ChannelItem;
    return channelItem.data.channel.tvg.id || `channel-${index}`;
  }, []);

  const overrideItemLayout = useCallback((layout: any, item: ChannelListItem) => {
    if (item.type === "search_bar" || item.type === "empty") {
      layout.span = 3;// Approximate heights
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