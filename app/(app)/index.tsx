import AddForm from "@/components/form/AddForm";
import { Colors } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { Image } from "expo-image";
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
        <Image
          style={styles.logo}
          source={require("@/assets/images/bbtp-logo.png")}
          contentFit="contain"
        />
        <AddForm />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 10,
  },
});
