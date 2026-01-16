
import CategoryCard from "@/components/card/CategoryCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "@/hooks/useTheme";
import { CategoryList } from "@/types/playlistType";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  View
} from "react-native";

export type LayoutItem = { type: "search_bar" | "empty" };
export type CategoryItem = { type: "category"; data: CategoryList };
export type CategoryListItem = LayoutItem | CategoryItem;

const Category = () => {
const { playlistId } = useLocalSearchParams<{
    playlistId: string;
  }>();
  const { isDark } = useTheme();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { getPlaylist, setSelectedPlaylist } = usePlaylistStore();
  
 const  handleOnLayout = () => {
      if (data) {
        setSelectedPlaylist(data);
      }
  };

  const data = useMemo(() => getPlaylist(playlistId), [playlistId, getPlaylist]);

  const filteredData = useMemo(() => {
    if (!data?.items) return [];
    if (!debouncedSearch.trim()) return data.items;
    
    const searchLower = debouncedSearch.toLowerCase().trim();
    return data.items.filter((item) =>
      item.category.toLowerCase().includes(searchLower)
    );
  }, [debouncedSearch, data?.items]);

  const listData: CategoryListItem[] = useMemo(() => {
    const header: LayoutItem = { type: "search_bar" };
    const empty: LayoutItem = { type: "empty" };

    const items: CategoryItem[] = filteredData.map((item) => ({
      type: "category",
      data: item,
    }));

    return filteredData.length === 0 ? [header, empty] : [header, ...items];
  }, [filteredData]);

  const renderItem = useCallback(({ item, index }: { item: CategoryListItem; index: number }) => {
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
            placeholder="Search category..."
          />
        </View>
      );
    } else if (item.type === "empty") {
      return (
        <EmptyData
          icon="search"
          title="No categorys found"
          description="Try a different search term"
        />
      );
    }
    
    const categoryData = (item as CategoryItem).data;
    return (
        <CategoryCard 
          category={categoryData}
        />
    );
  }, [isDark, search]);

  const keyExtractor = useCallback((item: CategoryListItem, index: number) => {
    if (item.type === "search_bar") return "header";
    if (item.type === "empty") return "empty";
    const categoryItem = item as CategoryItem;
    return categoryItem.data.category || `category-${index}`;
  }, []);

  const overrideItemLayout = useCallback((layout: any, item: CategoryListItem) => {
    if (item.type === "search_bar" || item.type === "empty") {
      layout.span = 3;
    } 
  }, []);

  const getItemType = useCallback((item: CategoryListItem) => {
    return item.type;
  }, []);

  return (
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
        overrideItemLayout={overrideItemLayout}
        stickyHeaderIndices={[0]}
        onLayout={handleOnLayout}
      />
  )
}

export default Category

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      list: {
        paddingBottom: 20,
        position: "relative",
      },
      headerContainer: {
        padding: 20,
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
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 20,
      },
      emptyText: {
        fontSize: 16,
        fontFamily: Fonts.brand,
        color: Colors.text,
        textAlign: "center",
      },
})