import { Colors, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View
} from "react-native";

// Enable layout animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I add a playlist?",
        answer: "To add a playlist, go to the Home tab and tap the '+' button in the bottom right corner. You can either:\n\n• Enter a playlist URL (M3U format)\n• Import from a file\n• Manually create a playlist\n\nOnce added, your playlist will appear on the home screen and you can organize it by categories."
      },
      {
        question: "What playlist formats are supported?",
        answer: "This app supports M3U and M3U8 playlist formats. These are the standard formats used by most IPTV services. Simply paste your playlist URL or upload the file to get started."
      },
      {
        question: "How do I navigate the app?",
        answer: "The app has three main sections:\n\n• Home: View and manage your playlists, browse categories, and access channels\n• Favorites: Quick access to your favorite channels\n• Settings: Customize the app appearance, view FAQs, and contact support\n\nTap on a playlist to see its categories, then tap a category to view available channels."
      }
    ]
  },
  {
    category: "Playlists & Channels",
    questions: [
      {
        question: "How do I update a playlist?",
        answer: "To update a playlist, go to the Home tab, find your playlist, and tap the refresh icon (⟳) next to it. The app will fetch the latest content from the playlist URL. Make sure you have an active internet connection."
      },
      {
        question: "Can I edit or delete a playlist?",
        answer: "Yes! You can edit a playlist by tapping the edit icon (✏️) next to it. To delete a playlist, tap the delete icon (🗑️). You'll be asked to confirm before deleting to prevent accidental removal."
      },
      {
        question: "How do I add channels to favorites?",
        answer: "While watching a channel, look for the favorite icon (★) in the player controls. Tap it to add the channel to your favorites. You can also access all your favorite channels from the Favorites tab in the bottom navigation."
      },
      {
        question: "How do categories work?",
        answer: "Categories are automatically created from your playlist based on channel groupings. Channels are organized by their category (e.g., Sports, News, Movies). You can browse channels by category for easier navigation."
      }
    ]
  },
  {
    category: "Playback & Quality",
    questions: [
      {
        question: "Why won't some channels load?",
        answer: "There could be several reasons:\n\n• The stream source may be temporarily unavailable\n• The stream format might not be compatible with your device\n• Your internet connection might be unstable\n• The playlist URL might be outdated\n\nTry refreshing the playlist or checking your internet connection."
      },
      {
        question: "The video is choppy or freezing",
        answer: "Video playback issues are usually related to:\n\n• Network speed: A stable 10 Mbps connection is recommended for HD streams\n• If you're on mobile data (4G/5G), check your signal strength or switch to Wi-Fi\n• Too many apps running: Close background apps to free up resources\n• Device performance: Older devices may struggle with high-quality streams"
      },
      {
        question: "The app is using too much battery",
        answer: "Video decoding, especially in HD, is processor-intensive and can drain battery quickly. To reduce battery usage:\n\n• Lower your device screen brightness\n• Use Wi-Fi instead of mobile data when possible\n• Close the app when not in use\n• Reduce video quality if available in player settings"
      },
      {
        question: "Certificate error or unsecure stream",
        answer: "This occurs when the original stream source uses HTTP instead of HTTPS (unencrypted). While our system attempts to handle this, some streams may be blocked by your device's security settings. Unfortunately, this is a limitation of the stream source, not the app."
      }
    ]
  },
  {
    category: "Troubleshooting",
    questions: [
      {
        question: "The app crashes or freezes",
        answer: "If the app crashes:\n\n• Force close the app and restart it\n• Check if you have the latest app version\n• Restart your device\n• Clear the app cache (device settings)\n• If issues persist, try uninstalling and reinstalling the app"
      },
      {
        question: "My playlist disappeared",
        answer: "Playlists are stored locally on your device. If a playlist disappears:\n\n• Check if you accidentally deleted it\n• The app data might have been cleared\n• If you reinstall the app, you'll need to re-add your playlists\n\nWe recommend keeping a backup of your playlist URLs."
      },
      {
        question: "Can't search for channels",
        answer: "Search functionality works within categories and playlists. Make sure:\n\n• You've selected a playlist or category\n• The search bar is visible at the top\n• You're typing in the correct search field\n\nSearch is available in the Home tab for playlists, in Categories for filtering categories, and in Channels for finding specific channels."
      }
    ]
  },
  {
    category: "Settings & Customization",
    questions: [
      {
        question: "How do I change the theme?",
        answer: "Go to Settings → Appearance. You can choose between:\n\n• Light mode: Traditional bright interface\n• Dark mode: Dark interface for low-light viewing\n• System: Automatically follows your device's theme settings"
      },
      {
        question: "Can I customize playback settings?",
        answer: "Playback settings depend on the stream source and your device capabilities. The player will automatically select the best quality available. Some streams may offer quality options in the player controls during playback."
      }
    ]
  }
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isDark: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isDark }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[
      styles.card,
      { 
        backgroundColor: isDark ? Colors.darkDark : Colors.background,
        shadowColor: isDark ? "#000" : "#000",
      }
    ]}>
      <Pressable 
        style={styles.header} 
        onPress={toggleExpand}
      >
        <Text style={[
          styles.question,
          { color: isDark ? Colors.textDark : Colors.text }
        ]}>
          {question}
        </Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={isDark ? Colors.primaryDark : Colors.primary}
        />
      </Pressable>
      
      {expanded && (
        <View style={[
          styles.answerContainer,
          { borderTopColor: isDark ? Colors.lightDark : Colors.light }
        ]}>
          <Text style={[
            styles.answer,
            { color: isDark ? Colors.mutedDark : Colors.muted }
          ]}>
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

interface SectionHeaderProps {
  title: string;
  isDark: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isDark }) => (
  <Text style={[
    styles.sectionHeader,
    { 
      color: isDark ? Colors.textDark : Colors.text,
      backgroundColor: isDark ? Colors.backgroundDark : Colors.gray,
      borderColor: isDark ? Colors.lightDark : Colors.gray,
    }
  ]}>
    {title}
  </Text>
);

export default function FaqScreen() {
  const { isDark } = useTheme();

  return (
    <ScrollView 
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.backgroundDark : Colors.gray }
      ]}
    >
      {FAQ_DATA.map((section, sectionIndex) => (
        <View key={sectionIndex}>
          <SectionHeader title={section.category} isDark={isDark} />
          {section.questions.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isDark={isDark}
            />
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[
          styles.footerText,
          { color: isDark ? Colors.mutedDark : Colors.muted }
        ]}>
          Still have a question?
        </Text>
        <Pressable 
          style={[
            styles.contactButton,
            { backgroundColor: isDark ? Colors.primaryDark : Colors.primary }
          ]}
          onPress={() => Linking.openURL("https://marcelin-sigha.vercel.app/about")}
        >
          <Text style={styles.contactButtonText}>Contact Support</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    fontFamily: Fonts.brandBlack,
  },
  card: {
    borderRadius: 0,
    marginBottom: 1,
    overflow: "hidden",
    elevation: 0,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    paddingRight: 12,
    fontFamily: Fonts.brandBlack,
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
  },
  answer: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.brand,
  },
  footer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 16,
    fontFamily: Fonts.brand,
  },
  contactButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contactButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: Fonts.brandBold,
  },
});