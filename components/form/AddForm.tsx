import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { groupPlaylistByCategory } from "@/hooks/usePlalist";
import { playlistService } from "@/services/playlistService";
import { MyCustomPlaylist } from "@/types/playlistType";
import generateId from "@/utils/generateID";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import parser from 'iptv-playlist-parser';
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

export interface FormProps {
  name: string;
  url: string;
  type: "upload" | "url" | "text";
  text: string;
}

const AddForm = () => {
  const router = useRouter();
  const { addPlaylist } = usePlaylistStore();
  const [formFields, setFormFields] = useState<FormProps>({
    type: "url",
    name: "",
    url: "",
    text: "",
  });
  const fetchPlaylistByUrl = useMutation({
    mutationFn: (url: string) => playlistService.getPlaylistByUrl(url),
    onSuccess: (data, variables, context) => {
      const playlist: MyCustomPlaylist = {
        id: generateId(),
        title: formFields.name,
        createdAt: new Date().toISOString(),
        type: formFields.type,
        url: formFields.type === "url" ? formFields.url : undefined,
        header: data.header,
        items: groupPlaylistByCategory(data.items),
      };

      addPlaylist(playlist);
      router.replace("/home")
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    }
  });

  const handleSubmit = () => {
    if (!formFields.name.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }
    if (formFields.type === "url") {
      if (!formFields.url.trim()) {
        Alert.alert("Error", "Please enter a playlist URL");
        return;
      }

      if (
        !formFields.url.startsWith("http://") &&
        !formFields.url.startsWith("https://")
      ) {
        Alert.alert("Error", "URL must start with http:// or https://");
        return;
      }

      fetchPlaylistByUrl.mutate(formFields.url);
    } else if (formFields.type === "text") {
      if (!formFields.text.trim()) {
        Alert.alert("Error", "Please enter playlist text");
        return;
      }
      const data = parser.parse(formFields.text);
      const playlist: MyCustomPlaylist = {
        id: generateId(),
        title: formFields.name,
        createdAt: new Date().toISOString(),
        type: formFields.type,
        url: undefined,
        header: data.header,
        text: formFields.text,
        items: groupPlaylistByCategory(data.items),
      };
      addPlaylist(playlist);
      router.replace("/home");
    } else {
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={"padding"}
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <Animated.Text entering={FadeInDown} style={styles.title}>
        Enter playlist information
      </Animated.Text>
      <View style={styles.formContainer}>
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.switchContainer}
        >
          <TouchableOpacity
            onPress={() => {
              setFormFields((data) => {
                return { ...data, type: "upload" };
              });
            }}
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFormFields((data) => {
                return { ...data, type: "url" };
              });
            }}
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
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFormFields((data) => {
                return { ...data, type: "text" };
              });
            }}
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
          </TouchableOpacity>
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
                style={styles.input}
                placeholder="Playlist URL"
                value={formFields.url}
                onChangeText={(url) =>
                  setFormFields((data) => ({ ...data, url }))
                }
                placeholderTextColor={Colors.text}
              />
            ) : formFields.type === "text" ? (
              <TextInput
                style={[styles.input, { height: 100 }]}
                editable
                multiline
                placeholder="Playlist Text"
                placeholderTextColor={Colors.text}
                value={formFields.text}
                onChangeText={(text) =>
                  setFormFields((data) => ({ ...data, text }))
                }
              />
            ) : null}
          </Animated.View>
        </View>
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{ width: "100%" }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={fetchPlaylistByUrl.isPending}
          >
            <Text style={styles.buttonText}>
            {fetchPlaylistByUrl.isPending ? "Loading..." : "Submit"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddForm;

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
