import { Colors, Fonts } from "@/constants/theme";
import { CategoryList } from "@/types/playlistType";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CategoryCard = ({ category }: { category: CategoryList }) => {
  return (
      <Link href={`/home/category/${category.category}`} asChild>
        <TouchableOpacity style={styles.container}>
          <View style={styles.middleBlock}>
            <Text style={styles.title}>{category.category} ({category.items?.length})</Text>
          </View>
        </TouchableOpacity>
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
    color: Colors.text,
  },
  middleBlock: {
    flex: 1,
  },
});
