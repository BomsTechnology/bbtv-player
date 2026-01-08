import { Colors, Fonts } from "@/constants/theme";
import { usePlaylistStore } from "@/hooks/use-playliststore";
import { groupPlaylistByCategory } from "@/hooks/usePlalist";
import { playlistService } from "@/services/playlistService";
import { MyCustomPlaylist } from "@/types/playlistType";
import generateId from "@/utils/generateID";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import parser from "iptv-playlist-parser";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

const DEFAULT_PLAYLIST = {
  name: "Default Playlist",
  url: "https://iptv-org.github.io/iptv/index.m3u",
};

const AddForm = ({ showDefault }: { showDefault?: boolean }) => {
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
    onSuccess: (data) => {
      const playlist: MyCustomPlaylist = {
        id: generateId(),
        title: formFields.name || "Untitled Playlist",
        createdAt: new Date().toISOString(),
        type: formFields.type,
        url: formFields.type === "url" ? formFields.url : undefined,
        header: data.header,
        items: groupPlaylistByCategory(data.items),
      };

      addPlaylist(playlist);
      router.replace("/home");
    },
    onError: (error: any) => {
      Alert.alert(
        "Connection Error",
        error.message || "Could not fetch playlist."
      );
    },
  });

  const isLoading = fetchPlaylistByUrl.isPending;

  const handleAddDefault = () => {
    setFormFields({
      ...formFields,
      type: "url",
      name: DEFAULT_PLAYLIST.name,
      url: DEFAULT_PLAYLIST.url,
    });
    fetchPlaylistByUrl.mutate(DEFAULT_PLAYLIST.url);
  };

  const handleSubmit = () => {
    const { name, url, text, type } = formFields;

    if (!name.trim()) {
      return Alert.alert("Required", "Please enter a playlist name");
    }

    if (type === "url") {
      if (!url.trim() || !url.startsWith("http")) {
        return Alert.alert(
          "Invalid URL",
          "Please enter a valid http/https URL"
        );
      }
      fetchPlaylistByUrl.mutate(url);
    } else if (type === "text") {
      if (!text.trim()) {
        return Alert.alert("Required", "Please paste your M3U text");
      }

      try {
        const data = parser.parse(text);
        const playlist: MyCustomPlaylist = {
          id: generateId(),
          title: name,
          createdAt: new Date().toISOString(),
          type: "text",
          url: undefined,
          header: data.header,
          text: text,
          items: groupPlaylistByCategory(data.items),
        };
        addPlaylist(playlist);
        router.replace("/home");
      } catch (e) {
        Alert.alert(
          "Parse Error",
          "The text provided is not a valid M3U format."
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <Animated.Text entering={FadeInDown} style={styles.title}>
        Enter playlist information
      </Animated.Text>

      <View style={styles.formContainer}>
        {/* Tab Switcher */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          style={styles.switchContainer}
        >
          {["url", "text"].map((t) => (
            <Pressable
              key={t}
              disabled={isLoading}
              onPress={() =>
                setFormFields((prev) => ({ ...prev, type: t as any }))
              }
              style={[
                styles.switch,
                {
                  backgroundColor:
                    formFields.type === t ? Colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.switchText,
                  {
                    color:
                      formFields.type === t ? Colors.background : Colors.text,
                  },
                ]}
              >
                {t.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </Animated.View>

        <View style={styles.inputContainer}>
          <Animated.View entering={FadeInDown.delay(200)}>
            <TextInput
              style={[styles.input, isLoading && { opacity: 0.5 }]}
              placeholder="Playlist name"
              editable={!isLoading}
              value={formFields.name}
              onChangeText={(name) => setFormFields((d) => ({ ...d, name }))}
              placeholderTextColor={Colors.muted}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            {formFields.type === "url" ? (
              <TextInput
                style={[styles.input, isLoading && { opacity: 0.5 }]}
                placeholder="https://example.com/playlist.m3u"
                editable={!isLoading}
                value={formFields.url}
                onChangeText={(url) => setFormFields((d) => ({ ...d, url }))}
                placeholderTextColor={Colors.muted}
                autoCapitalize="none"
              />
            ) : (
              <TextInput
                style={[
                  styles.input,
                  { height: 120, textAlignVertical: "top" },
                  isLoading && { opacity: 0.5 },
                ]}
                editable={!isLoading}
                multiline
                placeholder="Paste #EXTM3U content here..."
                placeholderTextColor={Colors.muted}
                value={formFields.text}
                onChangeText={(text) => setFormFields((d) => ({ ...d, text }))}
              />
            )}
          </Animated.View>
        </View>

        {/* Buttons */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          style={{ width: "100%", gap: 12 }}
        >
          <Pressable
            style={[styles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Playlist</Text>
            )}
          </Pressable>

          {showDefault && (
            <Pressable
              style={[styles.button, { backgroundColor: "#000" }]}
              onPress={handleAddDefault}
              disabled={isLoading}
            >
              <Text style={styles.buttonText} numberOfLines={1}>
                Add default playlist
              </Text>

              <Text style={styles.buttonTextSmall} numberOfLines={1}>
                https://iptv-org.github.io (+10 000)
              </Text>
            </Pressable>
          )}
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
  buttonTextSmall: {
    color: "#fff",
    fontFamily: Fonts.brand,
    fontSize: 10,
  },
});
