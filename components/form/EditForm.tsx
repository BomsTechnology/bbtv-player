import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { MyCustomPlaylist } from "@/types/playlistType";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";

const EditForm = ({ playlist }: { playlist: MyCustomPlaylist }) => {
  const { updatePlaylist } = usePlaylistStore();
  const router = useRouter();
  
  const [name, setName] = useState(playlist.title);

  const handleSubmit = () => {
    if (!name.trim()) {
      return Alert.alert("Error", "Please enter a playlist name");
    }

    updatePlaylist(playlist.id, {
      ...playlist,
      title: name.trim(),
      updatedAt: new Date().toISOString(),
    });
    
    if(router.canGoBack()) {
        router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <Animated.Text entering={FadeInDown} style={styles.title}>
        Edit playlist information
      </Animated.Text>

      <View style={styles.formContainer}>
        {/* Tab Switcher (Visual only, interactions disabled for Edit) */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.switchContainer}
        >
          {["url", "text"].map((t) => (
            <View
              key={t}
              style={[
                styles.switch,
                {
                  backgroundColor:
                    playlist.type === t ? Colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.switchText,
                  {
                    color:
                      playlist.type === t ? Colors.background : Colors.text,
                  },
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.inputContainer}>
          {/* Playlist Name Input */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.text}
            />
          </Animated.View>

          {/* Locked Source Input */}
          <Animated.View entering={FadeInDown.delay(300)}>
            {playlist.type === "url" ? (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={playlist.url}
                editable={false}
                placeholderTextColor={Colors.text}
              />
            ) : (
              <TextInput
                style={[
                  styles.input,
                  styles.disabledInput,
                  { height: 120, textAlignVertical: "top" },
                ]}
                editable={false}
                multiline
                value={playlist.text}
              />
            )}
          </Animated.View>
        </View>

        {/* Submit Button */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{ width: "100%" }}
        >
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update Playlist</Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditForm;

const styles = StyleSheet.create({
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.brandBlack,
    color: Colors.text,
    textAlign: "center",
  },
  formContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 20,
    gap: 20,
  },
  inputContainer: {
    width: "100%",
    gap: 10,
  },
  input: {
    borderColor: Colors.muted,
    borderWidth: 1,
    borderRadius: 5, // Matches AddForm
    padding: 10,
    width: "100%",
    fontFamily: Fonts.brandBold,
    height: 50,
    fontSize: 18,
    color: Colors.text,
  },
  disabledInput: {
    backgroundColor: Colors.light,
    opacity: 0.6,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light,
    borderRadius: 15,
    padding: 5,
    width: "100%",
  },
  switch: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  switchText: {
    fontFamily: Fonts.brandBold,
    fontSize: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: Fonts.brandBlack,
    fontSize: 20,
  },
});