import CategoryCard from "@/components/card/CategoryCard";
import EmptyData from "@/components/EmptyData";
import SearchInput from "@/components/form/SearchInput";
import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { useDebounce } from "@/hooks/useDebounce";
import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View
} from "react-native";


const Category = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { selectedPlaylist } = usePlaylistStore();

  const filteredData = useMemo(() => {
    const categories = selectedPlaylist?.items || [];
    if (!debouncedSearch.trim()) return categories;

    const searchLower = debouncedSearch.toLowerCase().trim();
    return categories.filter((item) =>
      item.category.toLowerCase().includes(searchLower)
    );
  }, [debouncedSearch, selectedPlaylist?.items]);

  return (
    <FlatList
        data={filteredData}
        renderItem={({ item }) => <CategoryCard category={item} />}
        keyExtractor={(item, index) => item.category}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        scrollToOverflowEnabled={true}
        stickyHeaderHiddenOnScroll={false}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search category..."
            />
          </View>
        }
        ListEmptyComponent={
          debouncedSearch ? (
            <EmptyData
              icon="search"
              title="No categories found"
              description={`No results for "${debouncedSearch}"`}
            />
          ) : (
            <EmptyData
              icon="folder-open-outline"
              title="No categories yet"
              description="This playlist doesn't seem to have any categories."
            />
          )
        }
      />
  )
}

export default Category

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      list: {
        gap: 10,
        paddingBottom: 20,
        backgroundColor: Colors.gray,
        position: "relative",
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
        position: "static",
      },
      input: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: Fonts.brand,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.gray,
        paddingTop: 20,
      },
      emptyText: {
        fontSize: 16,
        fontFamily: Fonts.brand,
        color: Colors.text,
        textAlign: "center",
      },
})