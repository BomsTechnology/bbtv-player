import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { MyCustomPlaylist } from "@/types/playlistType";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";
import { FormProps } from "./AddForm";

const EditForm = ({ playlist }: { playlist: MyCustomPlaylist }) => {
  const { updatePlaylist } = usePlaylistStore();
  const router = useRouter();
  const [formFields, setFormFields] = useState<FormProps>({
    type: playlist.type,
    name: playlist.title,
    url: playlist.url || "",
    text: playlist.text || "",
  });

  const handleSubmit = () => {
    if (!formFields.name.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }
    updatePlaylist(playlist.id, {
      ...playlist,
      title: formFields.name,
      updatedAt: new Date().toISOString(),
    });
    Alert.alert("Success", "Playlist updated successfully");
    router.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <Animated.Text entering={FadeInDown} style={styles.title}>
        Edit your playlist
      </Animated.Text>
      <View style={styles.formContainer}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.switchContainer}
        >
          <View
            style={[
              styles.switch,
              {
                backgroundColor:
                  formFields.type === "upload" ? Colors.primary : Colors.light,
                  display: 'none'
              },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                {
                  color:
                    formFields.type === "upload"
                      ? Colors.background
                      : Colors.text,
                },
              ]}
            >
              Upload file
            </Text>
          </View>
          <View
            style={[
              styles.switch,
              {
                backgroundColor:
                  formFields.type === "url" ? Colors.primary : Colors.light,
              },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                {
                  color:
                    formFields.type === "url" ? Colors.background : Colors.text,
                },
              ]}
            >
              URL
            </Text>
          </View>
          <View
            style={[
              styles.switch,
              {
                backgroundColor:
                  formFields.type === "text" ? Colors.primary : Colors.light,
              },
            ]}
          >
            <Text
              style={[
                styles.switchText,
                {
                  color:
                    formFields.type === "text"
                      ? Colors.background
                      : Colors.text,
                },
              ]}
            >
              Text
            </Text>
          </View>
        </Animated.View>
        <View style={styles.inputContainer}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              value={formFields.name}
              onChangeText={(name) =>
                setFormFields((data) => ({ ...data, name }))
              }
              placeholderTextColor={Colors.text}
            />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300)}>
            {formFields.type === "url" ? (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Playlist URL"
                value={formFields.url}
                editable={false}
                placeholderTextColor={Colors.text}
              />
            ) : formFields.type === "text" ? (
              <TextInput
                style={[styles.input, { height: 100 }, styles.disabledInput]}
                editable={false}
                multiline
                placeholder="Playlist Text"
                placeholderTextColor={Colors.text}
                value={formFields.text}
              />
            ) : null}
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{ width: "100%" }}
        >
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
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
  textInput: {
    fontFamily: Fonts.brand,
  },
  input: {
    borderColor: Colors.muted,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: "100%",
    fontFamily: Fonts.brandBold,
    height: 50,
    fontSize: 18,
  },
  disabledInput: {
    backgroundColor: Colors.light,
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
