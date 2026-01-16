import { categories } from "@/constants/categories";
import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { CategoryList } from "@/types/playlistType";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CategoryCard = ({ category }: { category: CategoryList }) => {
  const { isDark } = useTheme();
  return (
    <Link href={`/home/category/channel/${category.category}`} asChild>
      <Pressable style={styles.container}>
        <View  style={[
          styles.middleBlock,
        { 
          backgroundColor: isDark ? Colors.darkDark : Colors.background,
        }
      ]}>
          {categories[category.category.toLowerCase()] &&
          categories[category.category.toLowerCase()].icon ? (
            <Ionicons
              name={categories[category.category.toLowerCase()].icon}
              size={24}
              color={isDark ? Colors.primaryDark : Colors.primary}
            />
          ) : categories[category.category.toLowerCase()] ? (
            <Text style={styles.icon}>
              {categories[category.category.toLowerCase()].name}
            </Text>
          ) : (
            <Ionicons
              name={categories["default"].icon}
              size={24}
              color={isDark ? Colors.primaryDark : Colors.primary}
            />
          )}
          <View>
            <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.dark }]}>
              {category.category}
            </Text>
            <Text style={[styles.detail, { color: isDark ? Colors.mutedDark : Colors.muted }]}>
              Channels: {category.items?.length || 0}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 1.0,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
    textTransform: "capitalize",
  },
  detail: {
    fontSize: 14,
    fontFamily: Fonts.brand,
  },
  icon: {
    fontSize: 30,
  },
  middleBlock: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    
  },
});