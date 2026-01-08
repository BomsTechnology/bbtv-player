import AddForm from "@/components/form/AddForm";
import { Colors } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { data } = usePlaylistStore();
  if(!data){
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }
  if(data.length > 0){
    return <Redirect href="/home" />;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AddForm showDefault />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 10,
  },
});
