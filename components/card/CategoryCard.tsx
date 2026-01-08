import { categories } from "@/constants/categories";
import { Colors, Fonts } from "@/constants/theme";
import { CategoryList } from "@/types/playlistType";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const CategoryCard = ({ category }: { category: CategoryList }) => {
  return (
      <Link href={`/home/category/${category.category}`} asChild>
        <Pressable style={styles.container}>
          <View style={styles.middleBlock}>
            <Ionicons name={categories[category.category.toLowerCase()] ? categories[category.category.toLowerCase()].icon : categories['default'].icon } size={24} color={Colors.primary} />
            <View>
            <Text style={styles.title}>{category.category}</Text>
            <Text style={styles.detail} >Channels: {category.items?.length}</Text>
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
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.0,
    elevation: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.brandBold,
    color: Colors.dark,
    textTransform: "capitalize",
  },
  detail: {
    fontSize: 14,
    fontFamily: Fonts.brand,
    color: Colors.muted,
  },
  middleBlock: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
